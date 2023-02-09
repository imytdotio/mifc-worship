import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Test
 **/

export const Roster = (props) => {
  const { user } = useContext(AuthContext);
  const [availables, setAvailables] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [skills, setSkills] = useState([]);

  const [selectedNickname, setSelectedNickname] = useState([]);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const handleNicknameClick = (uid, date, skill) => {
    const selected = { uid, date, skill };
    let updatedSelectedNickname;

    if (
      selectedNickname.some(
        (item) => item.uid === uid && item.date === date && item.skill === skill
      )
    ) {
      updatedSelectedNickname = selectedNickname.filter(
        (item) => item.uid !== uid || item.date !== date || item.skill !== skill
      );
    } else {
      updatedSelectedNickname = [...selectedNickname, selected];
    }

    setSelectedNickname(updatedSelectedNickname);
    setShowSelectedOnly(false);
  };

  const handleShowSelectedOnlyClick = () => {
    setShowSelectedOnly(!showSelectedOnly);
  };

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

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {/* <h1>Test</h1> */}
      {/* <h1>{user && user.id}</h1> */}

      {availables
        .filter((available) => {
          const availableDate = new Date(available.date);
          return availableDate >= new Date();
        })
        .map((available) => (
          <div
            key={available.date}
            className="bg-white rounded-md p-6 shadow-md mb-4 2xl:w-1/3 lg:w-2/3 w-full m-auto"
          >
            <h3 className="font-bold mb-4 text-center">{available.date}</h3>
            {skills.map((skill) => (
              <div key={skill.skill} className="flex flex-row mb-1 text-left gap-2">
                <p className="font-bold w-20 text-right mr-4">
                  {skill.skillName}
                </p>
                <p>
                  {skill.uid
                    .filter((uid) => {
                      if (showSelectedOnly) {
                        return selectedNickname.some(
                          (item) =>
                            item.uid === uid &&
                            item.date === available.date &&
                            item.skill === skill.skill
                        );
                      }
                      return available.uid.includes(uid);
                    })
                    .map((uid) => {
                      const user = userInfo.find((user) => user.uid === uid);
                      return user ? (
                        <button
                          key={user.uid}
                          onClick={() =>
                            handleNicknameClick(
                              user.uid,
                              available.date,
                              skill.skill
                            )
                          }
                          className={
                            showSelectedOnly
                              ? "bg-gray-200 mr-2 px-2 rounded-md mb-1 text-left"
                              : selectedNickname.some(
                                  (item) =>
                                    item.uid === user.uid &&
                                    item.date === available.date &&
                                    item.skill === skill.skill
                                )
                              ? "bg-teal-300 mr-2 px-2 rounded-md mb-1 text-left"
                              : "bg-gray-200 mr-2 px-2 rounded-md mb-1 text-left"
                          }
                        >
                          {user.nickname}
                        </button>
                      ) : (
                        ""
                      );
                    })}
                </p>
              </div>
            ))}
            {/* Show All / Selected Button */}
            <button
              className="mx-auto my-2 bg-teal-300 px-4 rounded-md duration-200 hover:shadow-md"
              onClick={() => setShowSelectedOnly(!showSelectedOnly)}
            >
              {showSelectedOnly ? "Show All" : "Confirm"}
            </button>
          </div>
        ))}
    </div>
  );
};
