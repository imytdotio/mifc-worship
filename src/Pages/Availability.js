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

const Datey = (props) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col md:flex-row m-auto justify-center py-4 px-8 rounded-xl border-2 border-slate-300 ">
      <div className="flex flex-row mb-2">
        <p className="mr-2 my-auto flex-1 md:flex-none text-left">{props.date}</p>
        <Checkbox
          isChecked={props.isChecked}
          onClick={(e) => {
            e.preventDefault();
            props.setCheck(e.target.value);
            //   console.log(e.value);
          }}
        />
      </div>
      <>
        {" "}
        <Input
          value={props.note}
          className="w-full"
          onChange={(e) => {
            props.setNote(e.target.value);
          }}
        />
      </>
    </div>
  );
};

export const Availability = (props) => {
  const { user } = useContext(AuthContext);
  const [dates, setDates] = useState();

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
        setDates(
          data
            .map(({ date, available, note }) => ({ date, available, note }))
            .sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })
        );
      }
    };

    fetchAvailability();
  }, []);

  const setCheck = async (uid, date, availability) => {
    const { data, error } = await supabase
      .from("availability")
      .update({ available: !availability })
      .eq("uid", uid)
      .eq("date", date)
      .select();
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      //   console.log(data);
    }
  };

  const setNote = async (uid, date, note) => {
    console.log("checking");
    const { data, error } = await supabase
      .from("availability")
      .update({ note: note })
      .eq("uid", uid)
      .eq("date", date)
      .select();

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
    }
  };

  return (
    <div className="md:w-2/3 w-full m-auto ">
      <h1>Availability</h1>
      <h1>{user && user.id}</h1>
      <div className="flex flex-col m-auto justify-center p-4 gap-4">
        {dates &&
          dates.map((date) => {
            return (
              <Datey
                date={date.date}
                isChecked={date.available}
                note={date.note}
                setCheck={(e) => {
                  //   e.preventDefault();
                  setCheck(user.id, date.date, date.available);
                }}
                setNote={(e) => {
                  setNote(user.id, date.date, e.target.value);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};
