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

  const [userNote, setUserNote] = useState([]);

  const [selectedNickname, setSelectedNickname] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
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

  const fetchAvailables = async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("date, uid, note")
      .order("date", { ascending: true });
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      const newy = data.reduce((acc, obj) => {
        const existing = acc.find((x) => x.date === obj.date);
        if (existing) {
          existing.uid.push(obj.uid);
        } else {
          acc.push({ date: obj.date, uid: [obj.uid] });
        }
        return acc;
      }, []);
      console.log(newy);

      setUserNote(data.filter((obj) => obj.note !== ""));
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
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchAvailables();
    fetchSkills();
  }, []);

  useEffect(() => {
    console.log(userNote);
  }, [userNote]);

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {/* <h1>Test</h1> */}
      {/* <h1>{user && user.id}</h1> */}

      {availables
        .filter((available) => {
          const availableDate = new Date(available.date);
          return availableDate >= new Date();
        })
        .filter((available) => {
          if (selectedDate) {
            console.log(selectedDate);
            console.log(available);
            return available.date === selectedDate;
            // return available;
          } else {
            return available;
          }
        })
        .map((available) => (
          <div
            key={available.date}
            className="bg-white rounded-md p-6 shadow-md mb-4 2xl:w-1/3 lg:w-2/3 w-full m-auto"
          >
            <h3 className="font-bold mb-4 text-center">{available.date}</h3>
            {skills.map((skill) => (
              <div key={skill.skill} className="flex flex-row mb-1">
                <p className="font-bold md:w-20 text-right md:mr-4 mr-2 basis-1/3 ">
                  {skill.skillName}
                </p>
                <p className="text-left basis-2/3">
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
                              ? "bg-gray-200 mr-2 px-2 rounded-md"
                              : selectedNickname.some(
                                  (item) =>
                                    item.uid === user.uid &&
                                    item.date === available.date &&
                                    item.skill === skill.skill
                                )
                              ? "bg-teal-300 mr-2 px-2 rounded-md"
                              : "bg-gray-200 mr-2 px-2 rounded-md md:mb-0 mb-1"
                          }
                        >
                          {user.nickname}

                          {/* Note */}
                          {userNote.map((note) => {
                            if (
                              note.date == available.date &&
                              note.uid == user.uid
                            ) {
                              // console.log(note.date);
                              return (
                                <div class="group relative justify-center inline-block">
                                  <span className="ml-1">°</span>
                                  <span class="absolute -top-10 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                                    {note.note}
                                  </span>
                                </div>
                              );
                            }
                          })}
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
              onClick={() => {
                if (selectedDate === null) {
                  setSelectedDate(available.date);
                } else {
                  setSelectedDate(null);
                }
                setShowSelectedOnly(!showSelectedOnly);
              }}
            >
              {showSelectedOnly ? "Show All" : "Confirm"}
            </button>
          </div>
        ))}
    </div>
  );
};
