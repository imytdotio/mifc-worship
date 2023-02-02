import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { CheckBlock, Pill } from "../Componenets/Components";
import { SignOut } from "../Componenets/Auth";
import { EditUser } from "../Componenets/EditUser";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <SignOut />
      {/* <Link to="/edituser">Edit</Link> */}
      {user && <EditUser uid="4e74e07f-d36f-4eb4-9654-802989c0d26e" />}
      {/* <Auth /> */}
    </>
  );
};
