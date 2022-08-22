import React from "react";
import { HideAlert } from "../../helpers/functions";

const ErrorAlert = (props) => {
  return (
    <div
      id={props.id}
      className='absolute z-40 top-5 right-5 w-72 h-auto p-5 rounded-md shadow-md bg-gradient-to-r from-red-700 via-gray-900 to-gray-900 transition-all duration-500 transform alert-hidden'
    >
      <h3 className='text-lg text-red-500 font-semibold'>{props.heading}</h3>
      <p className='text-white text-sm'>{props.alertMessage}</p>
      <button
        onClick={() => {
          HideAlert(props.id);
        }}
        className='bg-red-600 text-white w-full p-1 text-center rounded mt-2 transition-all active:scale-95'
      >
        Close
      </button>
    </div>
  );
};

export default ErrorAlert;
