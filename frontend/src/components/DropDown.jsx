import React from "react";
 
 const DropDown = ({ options = [], handleSelectChange }) => {
   return (
     <div>
       <select
        id="dropdown"
        name="dropdown"
        onChange={handleSelectChange}
        className="mt-1 h-10 block w-full pl-3 pr-10 py-2 text-base border-[#596F62] focus:outline-none focus:ring-[#7EA16B] focus:border-[#7EA16B] sm:text-sm rounded-md"
>
  {options && options.length > 0 ? (
    options.map((option) => (
      <option key={option.id} value={option.id} className="bg-[#1C3144] text-[#C3D898]">
        {option.name}
      </option>
    ))
  ) : (
    <option value="" className="bg-[#1C3144] text-[#C3D898]">
      No options available
    </option>
  )}
</select>

     </div>
   );
 };
 
 export default DropDown;