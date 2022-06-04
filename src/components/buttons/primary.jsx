import React from "react";

const PrimaryBtn = (props) => {
  // A primary full length button component
  // props required:
  // id - the id of the button component
  // type - the type of the button for eg. submit
  // text - the inner text of the button that will be displayed

  return (
    <button
      id={props.id}
      type={props.type}
      onClick={props.onClick}
      className='w-full p-3 bg-gray-800 text-white rounded-md transition-all hover:bg-gray-900 transform scale-100 active:scale-95'
    >
      {props.text}
    </button>
  );
};

export default PrimaryBtn;
