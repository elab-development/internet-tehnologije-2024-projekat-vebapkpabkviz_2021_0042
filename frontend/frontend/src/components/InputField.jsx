import React from "react";

const InputField = ({ label, type, name, value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm h-10"
        required
        {...(type === "number" ? { min: 0, max: 20 } : {})}
        {...(type === "password" ? { minLength: 8 } : {})}
      />
    </div>
  );
};

export default InputField;
