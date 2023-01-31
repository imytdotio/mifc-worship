import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Config/supabase";
import { Input } from "../Componenets/Components";

/**
 * @author
 * @function Availability
 **/

const Checkbox = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  return (
    <label className="relative cursor-pointer my-auto mr-2">
      <input
        type="checkbox"
        className="hidden"
        checked={props.isChecked}
        onChange={() => setIsChecked(!isChecked)}
        onClick={props.onClick}
      />
      <span
        className={`${
          isChecked ? "bg-teal-300" : "bg-gray-300"
        } w-6 h-6 rounded-lg flex items-center justify-center`}
      >
        {isChecked && (
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </label>
  );
};

const Date = (props) => {
  const { user } = useContext(AuthContext);
  const setNote = async (date, value) => {
    const { data, error } = await supabase
      .from("note")
      .eq("uid", user.id)
      .update();
  };
  return (
    <div className="flex flex-row m-auto justify-center py-4 px-8 rounded-xl border-2 border-slate-300 ">
      <p className="mr-2 my-auto">{props.date}</p>
      <Checkbox
        isChecked={props.isChecked}
        onClick={(e) => {
          e.preventDefault();
          props.setCheck(e.target.value);
          //   console.log(e.value);
        }}
      />
      <Input
        value={props.note}
        onChange={(e) => {
          props.setNote(props.date, e.target.value);
        }}
      />
    </div>
  );
};

export const Availability = (props) => {
  const { user } = useContext(AuthContext);
  const [aArray, setAArray] = useState(null);
  const [nArray, setNArray] = useState(null);
  const [combinedArray, setCombinedArray] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data, error } = await supabase
        .from("availability")
        .select()
        .eq("uid", user.id);

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        // setArray('asdfasdf')
        setAArray(
          Object.keys(data[0])
            .filter((key) => key !== "id")
            .filter((key) => key !== "created_at")
            .filter((key) => key !== "uid")
            .map((key) => [key, data[0][key]])
        );
      }
    };

    const fetchNote = async () => {
      const { data, error } = await supabase
        .from("note")
        .select()
        .eq("uid", user.id);

      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        setNArray(
          Object.keys(data[0])
            .filter((key) => key !== "id")
            .filter((key) => key !== "created_at")
            .filter((key) => key !== "uid")
            .map((key) => [key, data[0][key]])
        );
      }
    };

    fetchAvailability();
    fetchNote();
  }, []);

  useEffect(() => {
    const combineArray = (array1, array2) => {
      let tempArray = [];
      array1.forEach((item1) => {
        // console.log("item1", item1);
        array2.forEach((item2) => {
          // console.log("item2", item2);
          if (item1[0] === item2[0]) {
            tempArray.push([...item1, ...item2.slice(1)]);
          }
        });
      });
      setCombinedArray(tempArray);
    };
    if (aArray && nArray !== null) {
      combineArray(aArray, nArray);
    }
  }, [nArray, aArray]);

  useEffect(() => {
    // console.log(combinedArray);
  }, [combinedArray]);

  return (
    <div className="md:w-2/3 w-full p-8 m-auto ">
      <h1>Availability</h1>
      <h1>{user && user.id}</h1>
      <div className="flex flex-col m-auto justify-center p-8 gap-4">
        {/* <Date date="2022-01-18" isChecked={false} note="happy" /> */}
        {combinedArray &&
          combinedArray.map((item) => {
            return <Date date={item[0]} isChecked={item[1]} note={item[2]} />;
          })}
      </div>
    </div>
  );
};
