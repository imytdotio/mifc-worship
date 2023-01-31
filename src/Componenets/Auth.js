import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";
import { Button, Input, OutlineButton } from "./Components";

/**
 * @author
 * @function Auth
 **/

export const SignIn = (props) => {
  const { error, signUp, signInWithPassword } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="flex flex-col md:w-1/3 w-full justify-center m-auto gap-2">
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

export const SignOut = () => {
  const { signOut } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="m-auto">
      <p>{user && user.id}</p>
      <Button onClick={() => signOut()} className="w-full md:w-1/3">
        Sign out
      </Button>
    </div>
  );
};

