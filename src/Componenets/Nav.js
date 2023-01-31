import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Nav
 **/

export const Nav = (props) => {
  const { user } = useContext(AuthContext);
  const nav = "hover:border-b-2 hover:border-teal-400 duration-100 ease-in-out";
  return (
    <nav className="flex flex-row gap-2 justify-center my-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? `${nav} border-b-2 border-teal-400`
            : `${nav} border-b-2 border-b-transparent`
        }
      >
        Home
      </NavLink>
      {user ? (
        <>
          {" "}
          {/* <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive ? `border-b-2 border-teal-400 ${nav}` : `${nav}`
            }
          >
            Test
          </NavLink> */}
          <NavLink
            to="/availability"
            className={({ isActive }) =>
              isActive ? `border-b-2 border-teal-400 ${nav}` : `${nav}`
            }
          >
            Availability
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? `border-b-2 border-teal-400 ${nav}` : `${nav}`
            }
          >
            Account
          </NavLink>
        </>
      ) : (
        ""
      )}
    </nav>
  );
};
