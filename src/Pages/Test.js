import React, { useContext, useEffect, useState } from "react";
import { CheckBlock } from "../Componenets/Components";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Test
 **/

export const Test = (props) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="md:w-2/3 w-full m-auto ">
      <h1>Test</h1>
      <h1>{user && user.id}</h1>
      <></>
      {/* <div className="flex flex-col m-auto justify-center p-8 gap-4"></div> */}
    </div>
  );
};
