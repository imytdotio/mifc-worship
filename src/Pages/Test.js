import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

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
    return data;
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
    return data;
  }
};

const fetchUserSkills = async () => {
  const { data, error } = await supabase.from("profile").select("uid, skill");

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    return data;
  }
};

const fetchSkillNames = async () => {
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, skill_order");

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    return data;
  }
};

const RosterCard = (props) => {
  const { availables, userInfo, userSkills, skillNames } = props;

  // Find users available on the given date
  const usersAvailableOnDate = (date) => {
    return availables
      .filter((available) => available.date === date)
      .map((av) => av.uid);
  };

  // Find the nickname of a user given their uid
  const findUserNickname = (uid) => {
    const user = userInfo.find((user) => user.uid === uid);
    return user ? user.nickname : null;
  };

  // Find users with a specific skill
  const usersWithSkill = (skillId) => {
    return userSkills
      .filter((skill) => skill.skill === skillId)
      .map((sk) => sk.uid);
  };

  // Find users available on a date with a specific skill
  const usersAvailableWithSkill = (date, skillId) => {
    const availableUids = usersAvailableOnDate(date);
    const skillUids = usersWithSkill(skillId);

    // Find intersection of both arrays
    const commonUids = availableUids.filter((uid) => skillUids.includes(uid));

    return commonUids.map((uid) => findUserNickname(uid)).filter(Boolean);
  };
  const handleUserClick = (uid, date, skill) => {
    console.log(uid);
    console.log(date);
    console.log(skill);
  };

  return (
    <div className="bg-white rounded-md shadow-md py-4 px-8 md:w-1/2 w-full m-auto mb-4">
      <p className="font-bold">{props.date}</p>
      {skillNames
        .filter((skillName) => skillName.id !== 0)
        .sort((a, b) => a.skill_order - b.skill_order)
        .map((skillName) => {
          const usersForSkill = usersAvailableWithSkill(
            props.date,
            skillName.id
          );

          return (
            <div key={skillName.id}>
              <p className="text-left">
                {skillName.name}:
                {usersForSkill.map((nickname, idx) => {
                  const uid = userInfo.find(
                    (user) => user.nickname === nickname
                  )?.uid;
                  return (
                    <span key={uid}>
                      <span
                        onClick={() =>
                          handleUserClick(uid, props.date, skillName.id)
                        }
                      >
                        {nickname}
                      </span>
                      {idx !== usersForSkill.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
    </div>
  );
};

const preprocessData = (availables, userInfo, userSkills, skillNames) => {
  // Group availables by date
  const groupedByDate = availables.reduce((acc, available) => {
    if (!acc[available.date]) {
      acc[available.date] = [];
    }
    acc[available.date].push(available.uid);
    return acc;
  }, {});

  const processedData = Object.keys(groupedByDate).map((date) => {
    const usersAvailable = userInfo.filter((user) =>
      groupedByDate[date].includes(user.uid)
    );

    const skillsForUsers = usersAvailable.map((user) => {
      const skills = userSkills.filter((skill) => skill.uid === user.uid);
      return {
        ...user,
        skills: skills
          .map((skill) => {
            const skillNameObj = skillNames.find((s) => s.id === skill.skill);
            return skillNameObj ? skillNameObj.name : null;
          })
          .filter(Boolean),
      };
    });

    return {
      date: date,
      users: skillsForUsers,
    };
  });

  return processedData;
};



export const Test = (props) => {
  // const { user } = useContext(AuthContext);
  // const id = user.id;
  // console.log(id);

  const [loading, setLoading] = useState(true);
  const [availables, setAvailables] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [skillNames, setSkillNames] = useState([]);
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const availData = await fetchAvailables();
      const userData = await fetchUserInfo();
      const skillsData = await fetchUserSkills();
      const skillNamesData = await fetchSkillNames();

      setAvailables(availData);
      setUserInfo(userData);
      setUserSkills(skillsData);
      setSkillNames(skillNamesData);
      setLoading(false);
    };

    fetchData();
    // if user is true, then set id = user.id
  }, []);

  useEffect(() => {
    if (
      availables.length > 0 &&
      userInfo.length > 0 &&
      userSkills.length > 0 &&
      skillNames.length > 0
    ) {
      console.log("all data is here");
      const processedData = preprocessData(
        availables,
        userInfo,
        userSkills,
        skillNames
      );
      setProcessed(processedData);
    }
  }, [availables, userInfo, userSkills, skillNames]);

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Loaded</p>
          {processed.map((data) => (
            <RosterCard
              key={data.date}
              date={data.date}
              skillNames={skillNames}
              availables={availables}
              userSkills={userSkills}
              userInfo={userInfo}
            />
          ))}
        </>
      )}
    </div>
  );
};
