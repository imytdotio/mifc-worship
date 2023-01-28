import React, { useContext, useEffect } from "react";
import { SignedIn } from "../Componenets/Auth";
import { AuthContext } from "../Context/AuthContext";
import { Login } from "./Login";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const { session } = useContext(AuthContext);
  return <div>{session ? <SignedIn /> : <Login />}</div>;
};
