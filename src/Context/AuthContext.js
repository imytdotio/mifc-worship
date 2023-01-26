import { supabase } from "../Config/supabase";
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     const { data} = await supabase.auth.getUser();
  //     setUser(data);
  //     console.log(data);
  //   };
  //   getUserInfo();
  // }, []);

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
    }
  };

  const signInWithPassword = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data) {
      setUser(data.user);
      setSession(data.session);
      setError(null);
      setIsAuthenticated(true);
      fetchProfile(data.user.id);
      console.log(data);
    }

    if (error) {
      setError(error);
      console.log(error.message);
      setIsAuthenticated(false);
      setUser(null);
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
