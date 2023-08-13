import React, { useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

const fetchAvailables = async (selectedMonth) => {
  const { data, error } = await supabase
    .from("availability")
    .select("date, uid, note")
    .like("date", `%-${selectedMonth}-%`)
    .order("date", { ascending: true });
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    console.log(data);
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

const fetchSaturdays = async () => {
  const { data, error } = await supabase
    .from("worship_weeks_2023")
    .select("date");

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    return data.map((obj) => obj.date);
  }
};

const fetchPlanned = async (selectedMonth) => {
  const { data, error } = await supabase
    .from("roster")
    .select("uid, date, skill")
    .like("date", `%-${selectedMonth}-%`);

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    console.log("p", data);
    return data;
  }
};

const NameButton = (props) => {
  const { uid, date, skill, nickname, list, setList } = props;

  // Check if the current combination exists in the list
  const isActive = list.some(
    (item) => item.uid === uid && item.date === date && item.skill === skill
  );

  return (
    <span
      className={`cursor-pointer mx-1 px-1 ${
        isActive ? "bg-teal-400" : "bg-gray-200"
      } rounded-md`}
      onClick={() => {
        console.log(uid, date, skill);
        // Toggle the combination in the list state
        if (isActive) {
          setList((prevList) =>
            prevList.filter(
              (item) =>
                !(
                  item.uid === uid &&
                  item.date === date &&
                  item.skill === skill
                )
            )
          );
        } else {
          setList((prevList) => [...prevList, { uid, date, skill }]);
        }
      }}
    >
      {nickname}
    </span>
  );
};

const RosterCard = (props) => {
  const { availables, userInfo, userSkills, skillNames, roster, user } = props;
  const [submitMessage, setSubmitMessage] = useState("");

  const [list, setList] = useState(
    roster.filter((item) => item.date === props.date)
  );
  const [showList, setShowList] = useState(false);

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

    if (showList) {
      // Filter by users in the list for the given date and skill
      return commonUids
        .filter((uid) =>
          list.some(
            (item) =>
              item.uid === uid && item.date === date && item.skill === skillId
          )
        )
        .map((uid) => findUserNickname(uid))
        .filter(Boolean);
    }

    return commonUids.map((uid) => findUserNickname(uid)).filter(Boolean);
  };

  const deleteRows = async (rows) => {
    const { error } = await supabase
      .from("roster")
      .delete()
      .in(
        "uid",
        rows.map((row) => row.uid)
      )
      .in(
        "date",
        rows.map((row) => row.date)
      )
      .in(
        "skill",
        rows.map((row) => row.skill)
      );

    if (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const insertRows = async (rows) => {
    const { error } = await supabase.from("roster").insert(rows);

    if (error) {
      console.error("Error inserting rows:", error);
    }
  };

  const submitList = async (planned, list) => {
    // Determine rows to delete and insert
    const toDelete = rowsToBeDeleted(planned, list);
    const toInsert = rowsToBeInserted(planned, list);

    // Delete and Insert operations
    await deleteRows(toDelete);
    await insertRows(toInsert);
  };

  // Function to handle the submit click
  const handleButtonClick = async (planned, list) => {
    if (!user) {
      setSubmitMessage("Login to submit.");
      return;
    }

    const isAdmin = userSkills.some(
      (skill) => skill.uid === user.id && skill.skill === 0
    );

    if (!isAdmin) {
      setSubmitMessage("You are not an admin.");
      return;
    }

    // If we reached this point, the user is an admin
    setSubmitMessage("Submitting...");

    // Determine rows to delete and insert
    const toDelete = rowsToBeDeleted(planned, list);
    const toInsert = rowsToBeInserted(planned, list);

    // Delete and Insert operations
    await deleteRows(toDelete);
    await insertRows(toInsert);

    setSubmitMessage("Submitted.");
  };

  return (
    <div className="bg-white rounded-md shadow-md py-4 px-8 md:w-1/2 w-full m-auto mb-4">
      <div className="flex">
        <p className="font-bold flex-1">{props.date}</p>
        <button onClick={() => setShowList(!showList)}>👁️</button>
      </div>
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
                    <NameButton
                      uid={uid}
                      date={props.date}
                      skill={skillName.id}
                      nickname={nickname}
                      list={list}
                      setList={setList}
                      key={uid}
                    />
                  );
                })}
              </p>
            </div>
          );
        })}

      <button
        className="bg-gray-200 px-2 py-1 rounded-md hover:shadow-md my-2"
        onClick={() => {
          handleButtonClick(roster, list);
        }}
      >
        Submit
      </button>
      {submitMessage && <p>{submitMessage}</p>}
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

const rowsToBeDeleted = (planned, list) => {
  return planned.filter(
    (p) =>
      !list.some(
        (l) => l.uid === p.uid && l.date === p.date && l.skill === p.skill
      )
  );
};

const rowsToBeInserted = (planned, list) => {
  return list.filter(
    (l) =>
      !planned.some(
        (p) => p.uid === l.uid && p.date === l.date && p.skill === l.skill
      )
  );
};

export const Roster = (props) => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [months, setMonths] = useState([]);
  const [availables, setAvailables] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [skillNames, setSkillNames] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    function handleFetchedDates(data) {
      // Extract months from the data
      const months = [
        ...new Set(data.map((date) => new Date(date).getMonth())),
      ];

      // Set the selectedMonth to be the month of the first date
      const selectedMonth = new Date(data[0]).getMonth() + 1;
      if (selectedMonth + 1 < 10) {
        setSelectedMonth(`0${selectedMonth}`);
      } else {
        setSelectedMonth(selectedMonth);
      }

      setMonths(months);
    }

    fetchSaturdays().then((data) => {
      console.log(data);
      handleFetchedDates(data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchAvailables(selectedMonth),
      fetchUserInfo(),
      fetchUserSkills(),
      fetchSkillNames(),
      fetchPlanned(selectedMonth),
    ]).then(
      ([availData, userData, skillsData, skillNamesData, plannedData]) => {
        setAvailables(availData);
        setUserInfo(userData);
        setUserSkills(skillsData);
        setSkillNames(skillNamesData);
        setPlanned(plannedData);
        setLoading(false);
      }
    );
  }, [selectedMonth]);

  const processedData = useMemo(() => {
    if (
      availables.length > 0 &&
      userInfo.length > 0 &&
      userSkills.length > 0 &&
      skillNames.length > 0
    ) {
      return preprocessData(availables, userInfo, userSkills, skillNames);
    }
    return [];
  }, [availables, userInfo, userSkills, skillNames]);

  useEffect(() => {
    setProcessed(processedData);
  }, [processedData]);

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-2">
            <p className="font-bold">Select Month:</p>
            {months.map((month) => (
              <button
                className="px-1 mx-1 bg-gray-200 rounded-md"
                onClick={() => {
                  if (month + 1 < 10) {
                    setSelectedMonth(`0${month + 1}`);
                  } else {
                    setSelectedMonth(month + 1);
                  }
                }}
              >
                {month + 1}
              </button>
            ))}
          </div>

          {selectedMonth &&
            processed
              .filter((data) => new Date(data.date) >= new Date())
              .map((data) => (
                <RosterCard
                  key={data.date}
                  date={data.date}
                  skillNames={skillNames}
                  availables={availables}
                  userSkills={userSkills}
                  userInfo={userInfo}
                  roster={planned}
                  user={user}
                />
              ))}
        </>
      )}
    </div>
  );
};

export const UpcomingRoster = (props) => {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [availables, setAvailables] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [skillNames, setSkillNames] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [processed, setProcessed] = useState([]);
  const [upcomingDate, setUpcomingDate] = useState(null);

  useEffect(() => {
    const findUpcomingSaturday = (dates) => {
      const now = new Date();
      for (let date of dates) {
        if (new Date(date) > now) {
          return date;
        }
      }
      return null;
    };

    fetchSaturdays().then((dates) => {
      const upcoming = findUpcomingSaturday(dates);
      if (upcoming) {
        setUpcomingDate(upcoming);
      }
    });
  }, []);

  useEffect(() => {
    if (upcomingDate) {
      setLoading(true);
      const selectedMonth = upcomingDate.split("-")[1];
      Promise.all([
        fetchAvailables(selectedMonth),
        fetchUserInfo(),
        fetchUserSkills(),
        fetchSkillNames(),
        fetchPlanned(selectedMonth),
      ]).then(
        ([availData, userData, skillsData, skillNamesData, plannedData]) => {
          setAvailables(availData);
          setUserInfo(userData);
          setUserSkills(skillsData);
          setSkillNames(skillNamesData);
          setPlanned(plannedData);
          setLoading(false);
        }
      );
    }
  }, [upcomingDate]);

  const processedData = useMemo(() => {
    if (
      availables.length > 0 &&
      userInfo.length > 0 &&
      userSkills.length > 0 &&
      skillNames.length > 0
    ) {
      return preprocessData(availables, userInfo, userSkills, skillNames);
    }
    return [];
  }, [availables, userInfo, userSkills, skillNames]);

  useEffect(() => {
    setProcessed(processedData);
  }, [processedData]);

  const [showRoster, setShowRoster] = useState(false);

  return (
    <div className="md:w-2/3 w-full m-auto">
      <button onClick={() => setShowRoster(!showRoster)} className="mb-4">
        {showRoster ? "Hide" : "Show"} Upcoming Roster
      </button>
      {showRoster ? (
        loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {upcomingDate &&
              processed
                .filter((data) => data.date === upcomingDate)
                .map((data) => (
                  <RosterCard
                    key={data.date}
                    date={data.date}
                    skillNames={skillNames}
                    availables={availables}
                    userSkills={userSkills}
                    userInfo={userInfo}
                    roster={planned}
                    user={user}
                  />
                ))}
          </>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
