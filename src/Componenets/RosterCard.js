import React, { useState } from "react";
import { NameButton } from "../Componenets/NameButton";
import { useContext, useEffect, useMemo } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

const rowsToBeDeleted = (planned, list, date) => {
  return planned.filter(
    (p) =>
      p.date === date &&
      !list.some(
        (l) => l.uid === p.uid && l.date === p.date && l.skill === p.skill
      )
  );
};

const rowsToBeInserted = (planned, list, date) => {
  return list.filter(
    (l) =>
      l.date === date &&
      !planned.some(
        (p) => p.uid === l.uid && p.date === l.date && p.skill === l.skill
      )
  );
};

export const RosterCard = (props) => {
  const {
    availables,
    userInfo,
    userSkills,
    skillNames,
    planned,
    user,
    visibility,
    setVisibility,
  } = props;
  const [submitMessage, setSubmitMessage] = useState("");

  const [list, setList] = useState(
    visibility.includes(props.date)
      ? planned.filter((item) => item.date === props.date)
      : []
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

  const isAdmin = useMemo(() => {
    return (
      user &&
      userSkills.some((skill) => skill.uid === user.id && skill.skill === 0)
    );
  }, [userSkills, user]);

  // Function to handle the submit click
  const handleSubmit = async (planned, list, date) => {
    if (!user) {
      setSubmitMessage("Login to submit.");
      return;
    }

    if (!isAdmin) {
      setSubmitMessage("You are not an admin.");
      return;
    }

    // If we reached this point, the user is an admin
    setSubmitMessage("Submitting...");

    // Determine rows to delete and insert
    const toDelete = rowsToBeDeleted(planned, list, date);
    const toInsert = rowsToBeInserted(planned, list, date);

    // Delete and Insert operations
    await deleteRows(toDelete);
    await insertRows(toInsert);

    setSubmitMessage("Submitted.");
    props.refetchPlannedData();
  };

  const handleVisibility = async (date) => {
    const { data, error } = await supabase
      .from("visibility")
      .select()
      .eq("date", date);

    if (error) {
      console.log(error);
      return;
    }

    if (data.length === 0) {
      // insert
      const { error } = await supabase
        .from("visibility")
        .insert([{ date: date }]);

      if (error) {
        console.log(error);
        return;
      }
      // Update the visibility state directly
      setVisibility((prevVisibility) => [...prevVisibility, date]);
    } else {
      // delete
      const { error } = await supabase
        .from("visibility")
        .delete()
        .eq("date", date);

      if (error) {
        console.log(error);
        return;
      }
      // Update the visibility state directly
      setVisibility((prevVisibility) =>
        prevVisibility.filter((d) => d !== date)
      );
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 py-4 px-8 md:w-1/2 w-full m-auto mb-4">
      <div className="flex">
        <p className="font-bold flex-1">{props.date}</p>
        <button onClick={() => setShowList(!showList)}>👁️</button>
        {isAdmin &&
          (visibility.some((date) => date === props.date) ? (
            <button onClick={() => handleVisibility(props.date)}>🐵</button>
          ) : (
            <button onClick={() => handleVisibility(props.date)}>🙈</button>
          ))}
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
              <p className="text-left my-1">
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
                      visibility={visibility}
                      key={uid}
                    />
                  );
                })}
              </p>
            </div>
          );
        })}

      {isAdmin && (
        <button
          className="hover:bg-gray-200 px-2 py-1 rounded-md hover:border-gray-400 border-2 my-2 duration-200"
          onClick={() => {
            handleSubmit(planned, list, props.date);
          }}
        >
          Submit
        </button>
      )}

      {submitMessage && <p>{submitMessage}</p>}
    </div>
  );
};
