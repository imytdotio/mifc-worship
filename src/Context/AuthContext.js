import { supabase } from "../Config/supabase";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (data) {
      console.log(data);
    }

    if (error) {
      setError(error);
      console.log(error.message);
    }
  };

  // test

  const fetchProfile = async (uid) => {
    const { data, error } = await supabase
      .from("team_members")
      .select()
      .eq("uid", uid);

    if (error) {
      console.log(error);
    }

    if (data) {
      console.log(data);
      setProfile(data[0]);
    }
  };

  // useEffect(() => {
  //   console.log(user);
  //   console.log(session);
  //   console.log(profile);
  // }, [user, session, profile]);

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error);
      setSession(null);
      console.log(error.message);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    if (data) {
      setUser(data.user);
      setSession(data.session);
      setError(null);
      setIsAuthenticated(true);
      console.log(data.user.id);
      fetchProfile(data.user.id);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error);
      console.log(error.message);
    } else {
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        fetchProfile,
        profile,
        signUp,
        signInWithPassword,
        signOut,
        session,
        error,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
