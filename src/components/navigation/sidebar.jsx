import React from "react";

import {
  BsGridFill,
  BsFillCollectionFill,
  BsFillFilePersonFill,
  BsFillPieChartFill,
  BsBookFill,
  BsFillCreditCardFill,
  BsFillPersonFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className='w-80 flex-none h-screen border-r overflow-auto'>
      <div className='flex w-full p-10 space-x-5'>
        <div className='w-14 h-14 rounded-md bg-blue-600'></div>
        <div>
          <h3 className='font-semibold text-lg'>Rayyan Dakhni</h3>
          <p className='text-gray-500 font-light text-sm'>Admin Dashboard</p>
        </div>
      </div>

      <div className='p-10 flex w-full flex-col space-y-5'>
        {/* Dashboard */}
        <button
          onClick={() => {
            navigate("/dashboard", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsGridFill />
          </span>
          Dashboard
        </button>

        {/* Subject Management */}
        <button
          onClick={() => {
            navigate("/dashboard/subject", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillCollectionFill />
          </span>
          Subjects Management
        </button>

        {/* Teachers Management */}
        <button
          onClick={() => {
            navigate("/dashboard/teacher", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillFilePersonFill />
          </span>
          Teachers Management
        </button>

        {/* Sections Management */}
        <button
          onClick={() => {
            navigate("/dashboard/section", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillPieChartFill />
          </span>
          Sections Management
        </button>

        {/* Students Management */}
        <button
          onClick={() => {
            navigate("/dashboard/student", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsBookFill />
          </span>
          Students Management
        </button>

        {/* Student Enrolments */}
        <button
          onClick={() => {
            navigate("/dashboard/enrolment", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillCreditCardFill />
          </span>
          Student Enrolments
        </button>

        {/* Fees Management */}
        <button
          onClick={() => {
            navigate("/dashboard/fees", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillCreditCardFill />
          </span>
          Fees Management
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            sessionStorage.removeItem("token");
            navigate("/login", { replace: true });
          }}
          className='flex w-full p-3 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'
        >
          <span className='p-1 mr-3'>
            <BsFillPersonFill />
          </span>
          Logout
        </button>
      </div>

      <h6 className='text-sm text-center text-gray-500 p-5'>
        A Product of <b className='text-blue-700'>DakhniTech</b>
      </h6>
    </div>
  );
};

export default Sidebar;
