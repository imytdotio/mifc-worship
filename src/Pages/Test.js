import React, { useContext, useEffect, useState } from "react";
import { supabase } from "../Config/supabase";
import { AuthContext } from "../Context/AuthContext";

/**
 * @author
 * @function Test
 **/

export const Test = (props) => {
  const { user } = useContext(AuthContext);
  const [availables, setAvailables] = useState();
  const [userInfo, setUserInfo] = useState();
  const fetchDate = async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("date, uid")
      .order("date", { ascending: true })
      .eq("available", true);
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const newy = data.reduce((acc, obj) => {
        const existing = acc.find((x) => x.date === obj.date);
        if (existing) {
          existing.uid.push(obj.uid);
        } else {
          acc.push({ date: obj.date, uid: [obj.uid] });
        }
        return acc;
      }, []);
      setAvailables(newy);
    }
  };

  const findNickname = async () => {
    const { data, error } = await supabase
      .from("members_info")
      .select("uid, nickname");
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setUserInfo(data);
      console.log(data);
    }
  };

  useEffect(() => {
    findNickname();
    fetchDate();
  }, []);
  return (
    <div className="md:w-2/3 w-full m-auto ">
      <h1>Test</h1>
      <h1>{user && user.id}</h1>
      {availables &&
        availables.map((available) => {
          return (
            <>
              <h2 className="font-bold">{available.date}</h2>
              <>
                {available.uid.map((uid) => {
                  return (
                    <p key={uid}>
                      {userInfo &&
                        userInfo.filter((info) => info.uid === uid)[0].nickname}
                    </p>
                  );
                })}
              </>
            </>
          );
        })}
      <></>
      {/* <div className="flex flex-col m-auto justify-center p-8 gap-4"></div> */}
    </div>
  );
};
