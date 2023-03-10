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
      setSkills(data.filter(skill => skill.skill !== 0));
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
    <div className="py-4 px-2 md:w-2/5 w-full m-auto bg-white rounded-xl shadow-lg my-4">
      {/* md:w-2/5 = 2/3*2/3 */}
      <div className="flex flex-col">
        <Input
          placeholder="????????????????????????"
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
          placeholder="????????????"
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
