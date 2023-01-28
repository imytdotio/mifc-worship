import React, { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Login } from "./Login";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const { session } = useContext(AuthContext);
  return <div>{session ? "hi" : <Login />}</div>;
};
