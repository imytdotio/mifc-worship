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
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <a className='text-blue-600 underline m-4' href='https://drive.google.com/drive/folders/1jfp-DfO8Dw3DsNfScjE6ajLNk57OeJzZ'>Google Drive</a>
      <Login />
    </div>
  );
};
