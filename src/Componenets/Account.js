import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Account
 **/

export const Account = (props) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  return (
    <>
      {isAuthenticated ? (
        <div>
          {/* <h1>Account - {user.id}</h1> */}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
