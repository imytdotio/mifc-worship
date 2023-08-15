import React, { useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { RosterCard } from "../Componenets/RosterCard";

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
    // console.log(data);
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

const fetchVisibility = async (selectedMonth) => {
  const { data, error } = await supabase
    .from("visibility")
    .select()
    .like("date", `%-${selectedMonth}-%`);

  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    return data.map((obj) => obj.date);
  }
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
  const [visibility, setVisibility] = useState([]);

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
      // console.log(data);
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
      fetchVisibility(selectedMonth),
    ]).then(
      ([
        availData,
        userData,
        skillsData,
        skillNamesData,
        plannedData,
        visibleWeeks,
      ]) => {
        setAvailables(availData);
        setUserInfo(userData);
        setUserSkills(skillsData);
        setSkillNames(skillNamesData);
        setPlanned(plannedData);
        setLoading(false);
        setVisibility(visibleWeeks);
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

  const refetchPlannedData = async () => {
    const updatedPlannedData = await fetchPlanned(selectedMonth);
    setPlanned(updatedPlannedData);
  };

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="mb-2">
            <p className="font-bold">Select Month:</p>
            {months.map((month) => {
              const monthValue = month + 1;
              const formattedMonth =
                monthValue < 10 ? `0${monthValue}` : `${monthValue}`;
              return (
                <button
                  className={`px-1 mx-1 rounded-md border-2 ${
                    selectedMonth === formattedMonth
                      ? "border-teal-400 bg-teal-400/20"
                      : "hover:border-gray-400 bg-gray-200"
                  } duration-200`}
                  onClick={() => {
                    setSelectedMonth(formattedMonth);
                  }}
                >
                  {monthValue}
                </button>
              );
            })}
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
                  planned={planned}
                  user={user}
                  visibility={visibility}
                  setVisibility={setVisibility}
                  refetchPlannedData={refetchPlannedData}
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
  const [visibility, setVisibility] = useState([]);

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
        fetchVisibility(selectedMonth),
      ]).then(
        ([
          availData,
          userData,
          skillsData,
          skillNamesData,
          plannedData,
          visibleWeeks,
        ]) => {
          setAvailables(availData);
          setUserInfo(userData);
          setUserSkills(skillsData);
          setSkillNames(skillNamesData);
          setPlanned(plannedData);
          setLoading(false);
          setVisibility(visibleWeeks);
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

  return (
    <div className="w-full m-auto">
      {loading ? (
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
                  planned={planned}
                  user={user}
                  visibility={visibility}
                  setVisibility={setVisibility}
                />
              ))}
        </>
      )}
    </div>
  );
};
