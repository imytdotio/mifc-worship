import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Button, Input, OutlineButton } from "./Components";

/**
 * @author
 * @function Auth
 **/

export const NotSignedIn = (props) => {
  const { error, signUp, signInWithPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Not Signed In</h1>
      <div className="flex flex-col w-1/3 justify-center m-auto gap-2">
        <Input
          value={email}
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => {
            e.preventDefault();
            setPassword(e.target.value);
          }}
          type="password"
        />
        <div className="flex flex-row justify-center gap-2">
          <OutlineButton
            className="flex-1"
            onClick={() => {
              signUp(email, password);
            }}
          >
            Sign up
          </OutlineButton>
          <Button
            className="flex-1"
            onClick={() => {
              //   props.signIn(email, password);
              signInWithPassword(email, password);
            }}
          >
            Sign In
          </Button>
        </div>
        <p>{error && error.message}</p>
      </div>
    </div>
  );
};

export const SignedIn = () => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div>
      <p>{user.id}</p>
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export const Auth = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Auth</h1>
      {user ? <SignedIn /> : <NotSignedIn />}
    </div>
  );
};
