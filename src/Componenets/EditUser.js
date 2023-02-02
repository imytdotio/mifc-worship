import React, { useContext, useState, useEffect, useReducer } from "react";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Config/supabase";
import { CheckBlock, Input } from "./Components";

/**
 * @author
 * @function EditUser
 **/

export const EditUser = (props) => {
  const { user } = useContext(AuthContext);

  // const [nickname, setNickname] = useState(null);
  // const [phoneNumber, setPhoneNumber] = useState(null);

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
      .eq("uid", uid)
      .select();
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      console.log(data);
    }
  };

  const updatePhoneNumber = async (uid) => {
    const { data, error } = await supabase
      .from("members_info")
      .update({ phoneNumber: state.phoneNumber })
      .eq("uid", uid)
      .select();
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      console.log(data);
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

    fetchInitData();
  }, []);

  const [skillNames, setSkillNames] = useState();
  const [skills, setSkills] = useState(null);

  const fetchSkillNames = async () => {
    const { data, error } = await supabase.from("skills").select();
    if (data) {
      setSkillNames(data);
    }
  };

  const findName = (id) =>
    skillNames.filter((skill) => skill.id === id)[0].name;

  const fetchSkills = async (uid) => {
    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("uid", props.uid)
      .order("skill", { ascending: true });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setSkills(data);
    }
  };
  useEffect(() => {
    fetchSkillNames();
    fetchSkills(props.uid);
  }, []);

  const addSkill = async (uid, skillId, haveSkill) => {
    const { data, error } = await supabase
      .from("profile")
      .update({ haveSkill: !haveSkill })
      .eq("uid", props.uid)
      .eq("skill", skillId);

    if (!error) {
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.skill === skillId ? { ...skill, haveSkill: !haveSkill } : skill
        )
      );
    }
  };

  return (
    <div className="py-4 md:w-2/3 w-full m-auto ">
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
          className="md:w-1/3 w-full m-auto"
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
          className="md:w-1/3 w-full m-auto"
        />
      </div>
      {skills &&
        skills.map((skill) => {
          return (
            <CheckBlock
              label={skillNames ? findName(skill.skill) : ""}
              key={skill.skill}
              element={skill.haveSkill}
              onClick={() => {
                addSkill(props.uid, skill.skill, skill.haveSkill);
              }}
            />
          );
        })}
    </div>
  );
};
