import React, { useContext, useEffect, useRef } from "react";
import { BiMenu } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
// AiOutlineMenu

export const Nav = () => {
  const { user } = useContext(AuthContext);
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarOpen && !navRef.current.contains(event.target)) {
        setNavbarOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [navbarOpen]);

  const navStyle =
    "text-right px-3 py-2 text-xs uppercase font-bold leading-snug text-slate-800 hover:bg-teal-400/25 rounded-full";
  return (
    <>
      <nav
        ref={navRef}
        className="relative bg-white rounded-3xl shadow-lg mb-12 flex flex-wrap items-center justify-between md:px-2 px-0 py-3 md:w-1/2 w-full mx-auto"
      >
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <NavLink
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-slate-800"
              to="/"
            >
              🌊 Flow Worship
            </NavLink>
            <button
              className="text-slate-800 cursor-pointer text-xl leading-none md:px-3 px-0 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <BiMenu />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto gap-2 justify-end w-full">
              <NavLink to="/desc" className={navStyle}>
                Description
              </NavLink>

              <NavLink to="/roster" className={navStyle}>
                Roster
              </NavLink>
              <NavLink to="/test" className={navStyle}>
                Test
              </NavLink>

              {user ? (
                <>
                  {" "}
                  <NavLink to="/availability" className={navStyle}>
                    Availability
                  </NavLink>
                </>
              ) : (
                ""
              )}

              <NavLink to={user ? "/account" : "/login"} className={navStyle}>
                {user ? "Account" : "sign in"}
              </NavLink>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
