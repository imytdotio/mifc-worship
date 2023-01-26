import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @author
 * @function Nav
 **/

export const Nav = (props) => {
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
      <NavLink
        to="/account"
        className={({ isActive }) =>
          isActive ? `border-b-2 border-teal-400 ${nav}` : `${nav}`
        }
      >
        Account
      </NavLink>
    </nav>
  );
};
