import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className='w-screen min-h-screen bg-gray-100 font-serif flex flex-col space-y-10 justify-center items-center'>
      <h1 className='text-8xl font-semibold'>Welcome</h1>
      <h3 className='text-4xl'>TO</h3>
      <h6 className='text-xl font-light tracking-wider'>
        Hamza Dakhni Institute Management
      </h6>
      <button
        onClick={() => {
          navigate("/addUser", { replace: true });
        }}
        className='p-5 px-20 bg-gradient-to-r from-blue-800 to-blue-500 text-white font-sans font-semibold text-lg tracking-wider rounded-lg transition-all active:scale-95'
      >
        Next
      </button>
    </div>
  );
};

export default Welcome;
