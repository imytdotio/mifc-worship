import React, { useContext, useEffect } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Test
 **/


export const Test = (props) => {
  const { user } = useContext(AuthContext);
  //   const create = async () => {
  //     const { data, error } = await supabase
  //       .from("availability")
  //       .insert([{ uid: user.id, date: new Date("2023-01-28"), note: "hello" }]);

  //     if (error) {
  //       console.log(error);
  //       return;
  //     }

  //     if (data) {
  //       console.log(data);
  //     }
  //   };



  return (
    <div className="md:w-2/3 w-full p-8 m-auto ">
      <h1>Test</h1>
      <h1>{user && user.id}</h1>
      <div className="flex flex-col m-auto justify-center p-8 gap-4"></div>
    </div>
  );
};
