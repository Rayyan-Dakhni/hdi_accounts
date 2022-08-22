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

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className='w-68 flex-none bg-gray-900 h-screen border-r overflow-auto'>
      <div className='flex w-full px-10 pt-10 space-x-5'>
        <div
          className='w-14 h-14 rounded-md bg-blue-600'
          style={{
            backgroundImage: `url('https://i.pinimg.com/originals/9d/0a/0e/9d0a0e0f1798ad455cb4be47f8da992d.jpg')`,
            backgroundSize: "100% 100%",
          }}
        ></div>
        <div>
          <h3 className='font-semibold text-white text-lg'>Hamza Dakhni</h3>
          <p className='text-gray-400 font-light text-sm'>Admin Dashboard</p>
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
            navigate("/dashboard/teacher", { replace: true });
          }}
        />

        {/* Assign Subject */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillFilePersonFill />}
          text='Assign Teacher'
          onClick={() => {
            navigate("/dashboard/assign", { replace: true });
          }}
        />

        {/* Sections Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillPieChartFill />}
          text='Sections Management'
          onClick={() => {
            navigate("/dashboard/section", { replace: true });
          }}
        />

        {/* Students Management */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsBookFill />}
          text='Students Management'
          onClick={() => {
            navigate("/dashboard/student", { replace: true });
          }}
        />

        {/* Student Enrolments */}
        <SecondaryBtn
          fullWidth={true}
          icon={<BsFillCreditCardFill />}
          text='Student Enrolments'
          onClick={() => {
            navigate("/dashboard/enrolment", { replace: true });
          }}
        />

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
