import React, { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Config/supabase";
import { CheckBlock, Input } from "./Components";

export const EditUser = (props) => {
  const { user } = useContext(AuthContext);

  const reducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_NICKNAME":
        return { ...state, nickname: action.value };
      case "CHANGE_PHONENUMBER":
        return { ...state, phoneNumber: action.value };
      case "SET_INITIAL_VALUES":
        return {
          ...state,
          nickname: action.payload.nickname,
          phoneNumber: action.payload.phoneNumber,
        };
      default:
        return state;
    }
  };

  const [state, dispatchFn] = useReducer(reducer, {
    nickname: "",
    phoneNumber: "",
  });

  const updateNickname = async (uid) => {
    const { data, error } = await supabase
      .from("members_info")
      .update({ nickname: state.nickname })
      .eq("uid", uid);
    if (error) {
      console.log(error);
      return;
    }
  };

  const updatePhoneNumber = async (uid) => {
    const { data, error } = await supabase
      .from("members_info")
      .update({ phoneNumber: state.phoneNumber })
      .eq("uid", uid);
    if (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    const fetchInitData = async () => {
      const { data, error } = await supabase
        .from("members_info")
        .select()
        .eq("uid", user.id);
      if (error) {
        console.log(error);
        return;
      }
      if (!data.length) {
        console.log('no user found')
        const { data, error } = await supabase
          .from("members_info")
          .insert([{ uid: user.id }])
          .select();
        if (error) {
          console.log(error);
          return;
        } else {
          console.log(data);
        }
      }
      if (data) {
        dispatchFn({
          type: "SET_INITIAL_VALUES",
          payload: {
            nickname: data[0].nickname,
            phoneNumber: data[0].phoneNumber,
          },
        });
      }
    };
    const fetchData = async () => {
      await fetchSkills();
      await fetchUserSkills(user.id);
    };

    fetchData();
    fetchInitData();
  }, []);

  const [skills, setSkills] = useState();
  const [userSkills, setUserSkills] = useState(null);

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select()
      .order("skill_order", { ascending: true });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setSkills(data);
    }
  };

  const fetchUserSkills = async (uid) => {
    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("uid", uid)
      .order("skill", { ascending: true });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const skillMap = data.reduce((map, skill) => {
        map[skill.skill] = skill.haveSkill;
        return map;
      }, {});
      setUserSkills(skillMap);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchUserSkills(user.id);
  }, []);

  const addSkill = async (uid, skillId, haveSkill) => {
    const insertRow = async () => {
      const { data, error } = await supabase
        .from("profile")
        .insert([{ uid, skill: skillId, haveSkill: true }])
        .select();
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(data);
      }
    };

    const removeRow = async () => {
      const { error } = await supabase
        .from("profile")
        .delete()
        .eq("uid", uid)
        .eq("skill", skillId);
    };

    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("uid", uid)
      .eq("skill", skillId);

    if (error || data.length === 0) {
      console.log("insert");
      insertRow();
    } else {
      console.log("remove", skillId);
      removeRow();
    }
    // const { data, error } = await supabase
    //   .from("profile")
    //   .update({ haveSkill: !haveSkill })
    //   .eq("uid", uid)
    //   .eq("skill", skillId);

    if (!error) {
      console.log("data", data);
      setUserSkills((prevSkills) => ({
        ...prevSkills,
        [skillId]: !haveSkill,
      }));
    } else {
      console.log(error);
    }
  };

  return (
    <div className="py-4 px-2 md:w-2/5 w-full m-auto bg-white rounded-xl shadow-lg my-4">
      <div className="flex flex-col">
        <Input
          placeholder="平時啲人點叫你？"
          onChange={(e) => {
            dispatchFn({ type: "CHANGE_NICKNAME", value: e.target.value });
          }}
          value={state.nickname}
          onBlur={() => {
            updateNickname(user.id);
          }}
          required={true}
          className="m-auto"
        />
        <Input
          placeholder="電話號碼"
          value={state.phoneNumber}
          onChange={(e) =>
            dispatchFn({ type: "CHANGE_PHONENUMBER", value: e.target.value })
          }
          onBlur={() => {
            updatePhoneNumber(user.id);
          }}
          required={true}
          className="m-auto"
        />
      </div>

      {skills &&
        skills.map((skill) => {
          const userHasSkill = userSkills ? userSkills[skill.id] : false;
          return (
            <CheckBlock
              label={skill.name}
              key={skill.id}
              element={userHasSkill}
              onClick={() => {
                console.log("u");
                addSkill(user.id, skill.id, userHasSkill);
              }}
            />
          );
        })}
    </div>
  );
};
