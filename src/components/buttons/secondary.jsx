import React from "react";

const SecondaryBtn = (props) => {
  // secondary button component
  // props required:
  // fullWidth - a boolean value to determine the width of the component
  // icon - the icon for the button
  // text - inner text of the button
  // onClick - the action to perform when the button is clicked

  const { fullWidth, icon, text, onClick } = props;

  if (fullWidth) {
    return (
      <button
        onClick={onClick}
        className='flex w-full p-3 bg-transparent text-white hover:bg-gray-600 rounded-md transition-all transform scale-100 active:scale-95'
      >
        <span className='p-1 mr-3'>{icon}</span>
        {text}
      </button>
    );
  } else {
    return (
      <button
        onClick={onClick}
        className='flex w-auto p-3 px-5 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
      >
        <span className='p-1 mr-3'>{icon}</span>
        {text}
      </button>
    );
  }
};

export default SecondaryBtn;
