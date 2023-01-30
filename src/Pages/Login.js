import React from "react";
import { SignIn, SignOut } from "../Componenets/Auth";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Login
 **/

export const Login = (props) => {
  const { user } = useContext(AuthContext);
  return <div>{user && user ? <SignOut /> : <SignIn />}</div>;
};
