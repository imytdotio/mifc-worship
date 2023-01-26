import React, { useContext, useEffect } from "react";
import { Account } from "../Componenets/Account";
import { Auth } from "../Componenets/Auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const navigate = useNavigate();
  const { isAuthenticated, isNewUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated && isNewUser) {
      navigate("./createuser");
    }
  }, []);

  return (
    <div>
      home
      {isAuthenticated ? <></> : <Auth />}
    </div>
  );
};
