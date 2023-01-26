import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Auth } from "./Auth";
import { Pill } from "./Components";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const navigate = useNavigate();
  const { user, profile } = useContext(AuthContext);
  const [array, setArray] = useState(null);
  useEffect(() => {
    checkNewUser();
    // console.log(profile);
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setArray(
        Object.keys(profile)
          .map((key) => [key, profile[key]])
          .filter((arr) => {
            return arr[1] === true;
          })
      );
    }
  }, [profile]);

  const checkNewUser = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select()
      .eq("uid", user.id);

    if (data && data.length === 0) {
      navigate("/createuser");
    }

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Account</h1>
      <Link to="/edituser">Edit</Link>
      <br />
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

      <Auth />
    </>
  );
};
