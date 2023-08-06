import { createContext, useState } from "react";
import { supabase } from "../Config/supabase";
import { saturdays } from "../data/Saturdays";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // Basic Functions ------------------------------------------------------------------
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error);
      setError(error);
      return;
    }

    if (data) {
      console.log("Signed Up");
      setError(null);
      // insertSaturdays(data.user.id);
      fetch18Skills(data.user.id);
      createInfo(data.user.id)
    }
  };

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      console.log("message: ", error.message);
      setError(error);
      return;
    }

    if (data) {
      console.log(data);
      setUser(data.user);
      setSession(data.session);
      setError(null);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      setError(error);
      return;
    } else {
      setUser(null);
      setSession(null);
    }
  };

  // Extra Functions ------------------------------------------------------------------
  const createInfo = async (uid) => {
    const { data, error } = await supabase.from("members_info").insert({ uid });
    if (error) {
      console.log(error);
      return;
    }
  };

  const fetch18Skills = async (uid) => {
    const { data, error } = await supabase.from("skills").select();
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      // setSkills(data);
      createProfile(uid, data);
    }
  };

  const createProfile = async (uid, skills) => {
    for (const skill of skills) {
      // console.log(skill.id);
      const { data, error } = await supabase
        .from("profile")
        .insert({ uid, skill: skill.id, haveSkill: false });
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
      }
    }
  };

  const insertSaturdays = async (uid) => {
    for (const saturday of saturdays) {
      const { data, error } = await supabase
        .from("availability")
        .insert([{ uid, date: new Date(saturday), note: "" }]);

      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        console.log(data);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signInWithPassword,
        signOut,
        error,
        user,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
