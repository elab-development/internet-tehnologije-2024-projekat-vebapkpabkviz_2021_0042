import React from "react";

const Button = ({ type, text, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full h-10 inline-flex justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-white text-sm font-medium hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
      {text}
    </button>
  );
};

export default Button;
