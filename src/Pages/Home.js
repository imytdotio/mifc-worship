import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Account } from "../Componenets/Account";
import { Auth } from "../Componenets/Auth";
import { CreateUser } from "./CreateUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const navigate = useNavigate();
  const { isNewUser } = useContext(AuthContext);
  return (
    <div>
      <Auth />
      {isNewUser ? navigate("./createuser") : <></>}
      {/* <CreateUser /> */}
      <Account />
    </div>
  );
};
