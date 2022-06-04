import React from "react";

const Select = () => {
  return (
    <select
      onChange={props.onChange}
      value={props.value}
      className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
    >
      <option>{props.nullOption}</option>
      {props.array.map((arr) => {
        return (
          <option key={teacher.teacher_id} value={teacher.teacher_id}>
            {teacher.name}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
