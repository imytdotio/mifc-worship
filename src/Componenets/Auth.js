import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Button, Input, OutlineButton } from "./Components";

/**
 * @author
 * @function Auth
 **/

export const Auth = (props) => {
  const { signUp, signInWithPassword, signOut, isAuthenticated } =
    useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  return (
    <div className="md:w-1/3 w-full h-screen mx-auto">
      {isAuthenticated ? (
        <div className="py-8">
          <Button
            className="border-blue-600 border-2 m-2"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="flex flex-col p-8">
          <h2>Sign in</h2>
          <Input className="m-2" onChange={(e) => setEmail(e.target.value)} />
          <Input
            className="m-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-row ">
            <OutlineButton
              className="m-2 flex-1"
              onClick={(e) => {
                e.preventDefault();
                signUp(email, password);
              }}
            >
              Sign Up
            </OutlineButton>
            <Button
              className="m-2 flex-1"
              onClick={(e) => {
                e.preventDefault();
                signInWithPassword(email, password);
              }}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
