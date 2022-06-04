import React from "react";

const Textfield = (props) => {
  // a simple text field
  // props required:
  // type - the type of the input
  // onChange - a function that needs to be performed every time the value in the text field changes
  // value - the current value of the text field
  // placeholder - the placeholder for the text field

  return (
    <input
      type={props.type}
      className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
      onChange={props.onChange}
      placeholder={props.placeholder}
      value={props.value}
      required
    />
  );
};

export default Textfield;
