import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Pill } from "./Components";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const navigate = useNavigate();
  const { user, profile, fetchProfile } = useContext(AuthContext);
  const [array, setArray] = useState(null);

  useEffect(() => {
    fetchProfile(user.id);
    if (!profile) {
      navigate("/createuser");
    }
    if (profile) {
      setArray(
        Object.keys(profile)
          .map((key) => [key, profile[key]])
          .filter((arr) => {
            return arr[1] === true;
          })
      );
    }
  }, []);

  return (
    <>
      <h1>Account</h1>
      {/* <Link to="/edituser">Edit</Link> */}
      {/* <h1 className="">{profile && profile.nickname}</h1> */}
      {array && (
        <>
          <p className="mt-4">Skills</p>
          <p>{profile.nickname}</p>
          {array.map((skill) => {
            return <Pill key={skill[0]}>{skill[0]}</Pill>;
          })}
        </>
      )}

      {/* <Auth /> */}
    </>
  );
};
