import React, { useContext, useEffect } from "react";
import { Auth } from "../Componenets/Auth";
import { Link, useNavigate } from "react-router-dom";
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
  }, [isNewUser, isAuthenticated, navigate]);

  return (
    <div>
      home
      <Auth />
      <Link to="/createuser">Create</Link>
    </div>
  );
};
