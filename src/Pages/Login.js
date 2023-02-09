import React from "react";
import { SignIn, SignOut } from "../Componenets/Auth";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Account } from "./Account";
import { useNavigate } from "react-router-dom";

/**
 * @author
 * @function Login
 **/

export const Login = (props) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  return <div>{user && user ? navigate("/") : <SignIn />}</div>;
};
