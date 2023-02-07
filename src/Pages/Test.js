import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Test
 **/

export const Test = (props) => {
  const { user } = useContext(AuthContext);
  const [availables, setAvailables] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [skills, setSkills] = useState([]);
  const [result, setResult] = useState({});

  const fetchAvailables = async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("date, uid")
      .order("date", { ascending: true })
      .eq("available", true);
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const newy = data.reduce((acc, obj) => {
        const existing = acc.find((x) => x.date === obj.date);
        if (existing) {
          existing.uid.push(obj.uid);
        } else {
          acc.push({ date: obj.date, uid: [obj.uid] });
        }
        return acc;
      }, []);
      setAvailables(newy);
    }
  };

  const fetchUserInfo = async () => {
    const { data, error } = await supabase
      .from("members_info")
      .select("uid, nickname");
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setUserInfo(data);
      console.log("data", data);
    }
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("profile")
      .select(
        `uid, 
      skill, 
      skills(name)`
      )
      .eq("haveSkill", true);

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const trimmedSkill = data
        .reduce((acc, curr) => {
          const existingSkill = acc.find((s) => s.skill === curr.skill);
          if (existingSkill) {
            existingSkill.uid.push(curr.uid);
          } else {
            acc.push({
              skill: curr.skill,
              skillName: curr.skills.name,
              uid: [curr.uid],
            });
          }
          return acc;
        }, [])
        .sort((a, b) => a.skill > b.skill);
      setSkills(trimmedSkill);
      console.log(trimmedSkill);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAvailables();
    fetchSkills();
  }, []);

  // useEffect(() => {
  //   if (userInfo && skills && availables) {
  //     console.log("userInfo", userInfo);
  //     console.log("skills", skills);
  //     console.log("availables", availables);
  //   }
  // }, [userInfo, skills, availables]);

  useEffect(() => {
    if (availables.length && userInfo.length && skills.length) {
      const result = {};

      availables.forEach((available) => {
        result[available.date] = {};
        available.uid.forEach((uid) => {
          const user = userInfo.find((userInfo) => userInfo.uid === uid);
          skills.forEach((skill) => {
            if (skill.uid.includes(uid)) {
              if (!result[available.date][skill.skillName]) {
                result[available.date][skill.skillName] = [];
              }
              result[available.date][skill.skillName].push(user.nickname);
            }
          });
        });
      });

      setResult(result);
    }
  }, [availables, userInfo, skills]);
  return (
    <div className="md:w-2/3 w-full m-auto ">
      <h1>Test</h1>
      <h1>{user && user.id}</h1>
      {result &&
        Object.keys(result).map((date) => {
          // console.log(Date(date));
          console.log('dad', Date(date));
        })}

      {Object.keys(result).map((date) => (
        <div
          className="bg-white rounded-md p-6 shadow-md mb-4 text-left 2xl:w-1/3 lg:w-2/3 w-full m-auto"
          key={date}
        >
          <h1 className="font-bold mb-4 text-center">{date}</h1>

          {Object.keys(result[date]).map((skillName) => (
            <div className="mb-1 flex flex-row" key={skillName}>
              <p className="font-bold w-20 text-right mr-4">{skillName} </p>
              {/* <p>{result[date][skillName].join(", ")}</p> */}
              {result[date][skillName].map((i) => {
                return (
                  <p className="bg-gray-200 mr-2 px-2 rounded-md hover:bg-teal-400 hover:text-white hover:font-bold">
                    {i}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
