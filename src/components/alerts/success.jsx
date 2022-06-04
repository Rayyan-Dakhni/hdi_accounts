import React from "react";

const SuccessAlert = (props) => {
  function HideAlert(id) {
    const alert = document.getElementById(id);

    alert.style.visibility = "hidden";
    alert.style.opacity = 0;
    alert.style.transform = "translateY(-1.25rem)";
  }

  return (
    <div
      id={props.id}
      className='absolute z-40 top-5 right-5 w-72 h-auto p-5 rounded-md shadow-md bg-gradient-to-r from-green-700 via-gray-900 to-gray-900 transition-all duration-500 transform -translate-y-5 opacity-0 invisible'
    >
      <h3 className='text-lg text-green-500 font-semibold'>{props.heading}</h3>
      <p className='text-white text-sm'>{props.alertMessage}</p>
      <button
        onClick={() => {
          HideAlert(props.id);
        }}
        className='bg-green-600 hover:bg-green-400 text-white w-full p-1 text-center rounded mt-2'
      >
        Close
      </button>
    </div>
  );
};

export default SuccessAlert;
