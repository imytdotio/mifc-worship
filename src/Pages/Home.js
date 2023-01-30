import React, { useContext, useEffect, useState } from "react";
import { SignedIn, SignIn, SignOut } from "../Componenets/Auth";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Login } from "./Login";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);
    console.log(data);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {user && user ? "got User" : "no user"}
      <Login />
    </div>
  );
};
