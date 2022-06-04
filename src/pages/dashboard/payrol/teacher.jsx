import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiUrl from "../../../config";

const TeacherPayroll = () => {
  const location = useLocation();

  const { teacher_id, teacher_name, rate, amount } = location.state;

  const date = new Date();

  const [details, setDetails] = useState([]);

  function GetDetails(id) {
    fetch(`${apiUrl}/payroll/teacher/?id=${id}`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setDetails(data);
      });
  }

  useEffect(() => {
    if (!teacher_id) {
    }

    GetDetails(teacher_id);
  }, []);

  return (
    <div className='w-screen min-h-screen bg-gray-100 flex justify-center items-center'>
      <div className='w-1/3 bg-white shadow-lg h-auto rounded-xl p-5'>
        <div className='w-20 h-20 rounded-md bg-blue-600 mx-auto'></div>
        <br />
        <div className='grid grid-cols-3 gap-2'>
          <p className='text-sm text-center font-light'>
            <b className='text-xs font-semibold uppercase'>Date: </b>
            <br />
            {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}
          </p>

          <p className='text-sm text-center font-light'>
            <b className='text-xs font-semibold uppercase'>Teacher Name: </b>
            <br />
            {teacher_name}
          </p>

          <p className='text-sm text-center font-light'>
            <b className='text-xs font-semibold uppercase'>Rate: </b>
            <br />
            {rate}%
          </p>

          <p></p>

          <p className='text-sm text-center font-light'>
            <b className='text-xs font-semibold uppercase'>Total: </b>
            <br />
            Rs. {amount}
          </p>
        </div>

        <br />

        <div className='grid grid-cols-2 gap-4'>
          {details.map((dt, index) => {
            return (
              <div key={index} className='w-full p-4 border-2 rounded-md'>
                <p className='text-sm font-light'>
                  <b className='text-xs font-semibold uppercase'>
                    Student Name:{" "}
                  </b>
                  <br />
                  {dt.student_name}
                </p>

                <p className='text-sm font-light'>
                  <b className='text-xs font-semibold uppercase'>
                    Subject Name:{" "}
                  </b>
                  <br />
                  {dt.subject_name}
                </p>

                <p className='text-sm font-light'>
                  <b className='text-xs font-semibold uppercase'>Fees: </b>
                  <br />
                  Rs. {dt.fees}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherPayroll;
