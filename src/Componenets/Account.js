import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Auth } from "./Auth";
import { Pill } from "./Components";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const navigate = useNavigate();
  const { profile, isAuthenticated } = useContext(AuthContext);
  const [array, setArray] = useState(null);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    setArray(
      Object.keys(profile)
        .map((key) => [key, profile[key]])
        .filter((arr) => {
          return arr[1] === true;
        })
    );
  }, []);

  return (
    <>
      <h1>Account</h1>
      {/* <h1 className="">{profile && profile.nickname}</h1> */}
      {array &&
        array.map((skill) => {
          return <Pill key={skill[0]}>{skill[0]}</Pill>;
        })}
      <Auth />
    </>
  );
};
