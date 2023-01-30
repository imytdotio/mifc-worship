import { createContext, useState } from "react";
import { supabase } from "../Config/supabase";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  // Functions ------------------------------------------------------------------
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
      console.log(data);
      setError(null);
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
      fetchProfile(data.user.id);
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
      console.log("logged out");
      setUser(null);
      setSession(null);
    }
  };

  const fetchProfile = async (uid) => {
    const { data, error } = await supabase
      .from("team_members")
      .select()
      .eq("uid", uid);

    if (data) {
      console.log(data);
      setProfile(data[0]);
    }

    if (error) {
      console.log(error);
      setError(error);
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
        fetchProfile,
        profile,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
