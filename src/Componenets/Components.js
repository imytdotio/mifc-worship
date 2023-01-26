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
      required={props.required}
      type={props.type}
    />
  );
};

export const Checkbox = (props) => {
  return (
    <div className="inline-block">
      <input
        type="checkbox"
        onChange={props.onChange}
        className={`mr-2 mb-2 ${props.className}`}
      />
      <label className="mr-4">{props.label}</label>
    </div>
  );
};

export const CheckBlock = (props) => {
  return (
    <button
      className={`inline-block cursor-pointer border-2 border-transparent hover:border-2 hover:border-teal-300 rounded-full py-2 px-3 mx-1 mb-2 ${
        props.element === true ? "bg-teal-300 " : ""
      }`}
      element={props.element}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};

export const Pill = (props) => {
  return (
    <div
      key={props.key}
      className={`inline-block cursor-pointer bg-teal-300 rounded-full py-2 px-3 mx-1 mb-2 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

export const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`rounded-xl text-white font-black bg-teal-400 py-2 hover:shadow-md duration-200 ${props.className}`}
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
