import React, { useContext, useEffect } from "react";
import { Auth } from "../Componenets/Auth";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div>
      home
      <Auth />
      <Link to="/createuser">Create</Link>
    </div>
  );
};
