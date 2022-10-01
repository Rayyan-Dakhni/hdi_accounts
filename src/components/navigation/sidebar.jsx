import React from "react";

import {
  BsGridFill,
  BsFillCollectionFill,
  BsFillFilePersonFill,
  BsFillPieChartFill,
  BsBookFill,
  BsFillCreditCardFill,
  BsFillPersonFill,
  BsFillFileEarmarkFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import SecondaryBtn from "../buttons/secondary";

import Logo from "../../assets/logo.PNG";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className='w-68 flex-none bg-gray-900 h-screen border-r overflow-auto'>
      <div className='flex w-full justify-center items-center px-5 pt-10 space-x-3'>
        <img
          src={Logo}
          alt='Logo'
          className='w-20 h-20 rounded-full bg-white p-2'
        />

        <div>
          <h3 className='font-semibold text-center text-white text-lg'>
            Hamza Dakhni <br /> Institute
          </h3>
          <p className='text-gray-400 text-center font-light text-sm'>
            Admin Dashboard
          </p>
        </div>
      </div>

      <div className='p-10 flex w-full flex-col space-y-5'>
        {/* Dashboard */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsGridFill />}
          text='Dashboard'
          onClick={() => {
            navigate("/dashboard", { replace: true });
          }}
        />

        {/* Subject Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillCollectionFill />}
          text='Subjects Management'
          onClick={() => {
            navigate("/dashboard/subjects/view", { replace: true });
          }}
        />

        {/* Teachers Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillFilePersonFill />}
          text='Teachers Management'
          onClick={() => {
            navigate("/dashboard/teacher/view", { replace: true });
          }}
        />

        {/* Assign Subject */}
        {/* <SecondaryBtn
          fullWidth={true}
          icon={<BsFillFilePersonFill />}
          text='Assign Teacher'
          onClick={() => {
            navigate("/dashboard/assign", { replace: true });
          }}
        /> */}

        {/* Sections Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillPieChartFill />}
          text='Sections Management'
          onClick={() => {
            navigate("/dashboard/section/view", { replace: true });
          }}
        />

        {/* Students Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsBookFill />}
          text='Students Management'
          onClick={() => {
            navigate("/dashboard/student/view", { replace: true });
          }}
        />

        {/* Student Enrolments */}
        {/* <SecondaryBtn
          fullWidth={true}
          icon={<BsFillCreditCardFill />}
          text='Student Enrolments'
          onClick={() => {
            navigate("/dashboard/enrolment", { replace: true });
          }}
        /> */}

        {/* Fees Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillCreditCardFill />}
          text='Fees Management'
          onClick={() => {
            navigate("/dashboard/fees", { replace: true });
          }}
        />

        {/* Payroll */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillFileEarmarkFill />}
          text='Payroll'
          onClick={() => {
            navigate("/dashboard/payroll", { replace: true });
          }}
        />

        {/* Logout */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillPersonFill />}
          text='Logout'
          onClick={() => {
            sessionStorage.removeItem("token");
            navigate("/", { replace: true });
          }}
        />
      </div>

      <h6 className='text-sm text-center text-gray-400 p-5'>
        A Product of <b className='text-blue-500'>DakhniTech</b>
      </h6>
    </div>
  );
};

export default Sidebar;
