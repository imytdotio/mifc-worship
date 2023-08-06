import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { supabase } from "../Config/supabase";

/**
 * @author
 * @function Availability
 **/

const Checkbox = (props) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  return (
    <label className="relative cursor-pointer my-auto md:mr-2 md:w-12">
      <input
        type="checkbox"
        className="hidden"
        checked={props.isChecked}
        onChange={() => setIsChecked(!isChecked)}
        onClick={props.onClick}
      />
      <span
        className={`hover:shadow-md duration-200 border-2 border-transparent hover:border-2  ${
          isChecked
            ? "bg-teal-300 hover:border-teal-600"
            : "bg-gray-200 hover:border-teal-300"
        } w-6 h-6 rounded-lg flex items-center justify-center `}
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
  const [input, setInput] = useState(props.note);

  return (
    <div className="flex flex-col md:flex-row md:w-2/3 m-auto w-full justify-center py-4 px-4 rounded-xl border-2 border-slate-300 ">
      <div className="flex flex-row mb-2 my-auto h-full">
        <p className="mr-2 my-auto flex-1 md:flex-none text-left">
          {props.date}
        </p>
        <Checkbox
          isChecked={props.isChecked}
          onClick={(e) => {
            e.preventDefault();
            props.setCheck();
            //   console.log(e.value);
          }}
        />
      </div>

      <input
        className={`flex flex-row rounded-md bg-transparent border-2 py-2 px-4 focus:border-teal-400 w-full`}
        onChange={(e) => {
          setInput(e.target.value);
          props.setNote(e.target.value);
        }}
        value={input}
        placeholder="note"
      />
    </div>
  );
};

export const Availability = (props) => {
  const { user } = useContext(AuthContext);
  const [dates, setDates] = useState();

  useEffect(() => {
    const fetchAvailability = async () => {
      const { data: availabilityData, error: availabilityError } =
        await supabase.from("availability").select().eq("uid", user.id);

      const { data: worshipWeeksData, error: worshipWeeksError } =
        await supabase.from("worship_weeks_2023").select();

      if (availabilityError || worshipWeeksError) {
        console.log(availabilityError, worshipWeeksError);
        return;
      }

      const combinedData = worshipWeeksData.map((week) => {
        const availability = availabilityData.find(
          (a) =>
            new Date(a.date).toDateString() ===
            new Date(week.date).toDateString()
        );
        return {
          date: week.date,
          available: !!availability,
          note: availability?.note || "",
        };
      });

      setDates(combinedData);
    };

    fetchAvailability();
  }, []);

  const rowExists = (date) => {
    return dates.some(d => new Date(d.date).toDateString() === new Date(date).toDateString() && d.available);
  };

  const insertRow = async (uid, date, note = "") => {
    const { data, error } = await supabase
      .from("availability")
      .insert([{ uid, date, note }]);
    
    if (error) {
      console.log(error);
      return;
    }

    // Update local state if needed
    setDates(prevDates => {
      const updatedDates = [...prevDates];
      const index = updatedDates.findIndex(d => new Date(d.date).toDateString() === new Date(date).toDateString());
      if (index !== -1) {
        updatedDates[index].available = true;
        updatedDates[index].note = note;
      }
      return updatedDates;
    });
  };


  const removeRow = async (uid, date) => {
    const { data, error } = await supabase
      .from("availability")
      .delete()
      .eq("uid", uid)
      .eq("date", date);

    if (error) {
      console.log(error);
      return;
    }

    // Update local state if needed
    setDates(prevDates => {
      const updatedDates = [...prevDates];
      const index = updatedDates.findIndex(d => new Date(d.date).toDateString() === new Date(date).toDateString());
      if (index !== -1) {
        updatedDates[index].available = false;
      }
      return updatedDates;
    });
  };

  const setCheck = async (uid, date) => {
    if (rowExists(date)) {
      removeRow(uid, date);
    } else {
      insertRow(uid, date);
    }
  };

  const setNote = async (uid, date, note) => {
    if (rowExists(date)) {
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

      // Update local state if needed
      setDates(prevDates => {
        const updatedDates = [...prevDates];
        const index = updatedDates.findIndex(d => new Date(d.date).toDateString() === new Date(date).toDateString());
        if (index !== -1) {
          updatedDates[index].note = note;
        }
        return updatedDates;
      });
    } else {
      insertRow(uid, date, note);
    }
  };

  //   const [tempString, setTempString] = useState("");

  return (
    <div className="md:w-2/3 w-full m-auto ">
      {/* <h1>{user && user.id}</h1> */}
      <div className="flex flex-col m-auto justify-center p-4 gap-4">
        {dates &&
          dates.map((date) => {
            return (
              <Datey
                date={date.date}
                key={date.id}
                isChecked={date.available}
                note={date.note}
                setCheck={() => {
                  setCheck(user.id, date.date, date.available);
                }}
                setNote={(tempStr) => setNote(user.id, date.date, tempStr)}
              />
            );
          })}
      </div>
    </div>
  );
};
