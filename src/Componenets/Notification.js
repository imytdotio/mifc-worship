import React from "react";

const Linktree = (props) => {
  return (
    <button
      className={`h-24 text-lg block border-2 border-teal-400 w-full mx-auto rounded-xl hover:shadow-md duration-200 ${props.className}`}
    >
      {props.title}
    </button>
  );
};

const Notification = () => {
  return (
    <div
      className={`h-24 table md:w-1/3 my-4 text-lg border-2 border-teal-400 w-full mx-auto rounded-xl hover:shadow-md duration-200 `}
    >
      <p className="align-middle table-cell text-center my-auto"></p>
    </div>
  );
};

export default Notification;
