import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Pill } from "./Components";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const { profile, isAuthenticated } = useContext(AuthContext);
  const array = Object.keys(profile)
    .map((key) => [key, profile[key]])
    .filter((arr) => {
      return arr[1] === true;
    });
  console.log(array);

  return (
    <>
      <h1 className="">{profile.nickname}</h1>
      {array.map((skill) => {
        return <Pill>{skill[0]}</Pill>;
      })}
    </>
  );
};
