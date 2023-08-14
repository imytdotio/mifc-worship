import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignIn, SignOut } from "../Componenets/Auth";
import Notification from "../Componenets/Notification";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Login } from "./Login";
import { UpcomingRoster } from "./Roster";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  const Linktree = (props) => {
    return (
      <Link to={props.link}>
        <button
          className={`h-24 text-lg block border-2 border-teal-400 w-full mx-auto rounded-xl hover:shadow-md duration-200 ${props.className}`}
        >
          {props.title}
        </button>
      </Link>
    );
  };

  {
    console.log(user);
  }
  return (
    <div className="bg-white rounded-3xl shadow-lg md:w-2/3 w-full m-auto p-8">
      {!user ? (
        <Linktree
          link="/login"
          title="🔐 Sign In"
          className="my-4 md:w-1/2 lg:w-1/2 mx-auto"
        />
      ) : (
        <>{/* <Notification /> */}</>
      )}
      <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 lg:w-1/2 mx-auto my-4">
        {user ? (
          <>
            <Linktree link="/account" title="🥷 Account" />
            <Linktree link="/availability" title="✅ Availability" />
          </>
        ) : (
          ""
        )}
        <a
          href="https://drive.google.com/drive/folders/1jfp-DfO8Dw3DsNfScjE6ajLNk57OeJzZ"
          target="_blank"
        >
          <button
            className={`h-24 text-lg block border-2 border-teal-400 w-full mx-auto rounded-xl hover:shadow-md duration-200 ${props.className}`}
          >
            📂 Google Drive
          </button>
        </a>
        <Linktree link="/roster" title="🙋‍♂️ Roster" />
        <Linktree link="/desc" title="✍️ Description" />
      </div>
      <UpcomingRoster />
      {/* <Login /> */}
    </div>
  );
};
