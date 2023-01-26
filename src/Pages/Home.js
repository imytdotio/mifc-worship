import React from "react";
import { Account } from "../Componenets/Account";
import { Auth } from "../Componenets/Auth";
import { CreateUser } from "./CreateUser";

/**
 * @author
 * @function Home
 **/

export const Home = (props) => {
  return (
    <div>
      <Auth />
      <CreateUser />
      <Account />
    </div>
  );
};
