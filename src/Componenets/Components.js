import React from "react";

/**
 * @author
 * @function Components
 **/

export const Input = (props) => {
  return (
    <input
      className={`rounded-md border-2 py-2 px-4 focus:border-teal-400 ${props.className}`}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onBlur={props.onBlur}
      value={props.value}
    />
  );
};

export const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-xl text-white font-bold bg-teal-400 py-2 hover:shadow-md duration-200 ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export const OutlineButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-xl text-teal-400 font-bold border-2 border-teal-400 py-2 hover:shadow-md duration-200 ${props.className}`}
    >
      {props.children}
    </button>
  );
};
