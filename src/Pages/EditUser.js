import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function EditUser
 **/

export const EditUser = (props) => {
  const { user } = useContext(AuthContext);

  const fetchUser = () => {
    
  };
  return <div>EditUser</div>;
};
