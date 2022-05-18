import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
import ErrorAlert from "../../../components/alerts/error";
import SuccessAlert from "../../../components/alerts/success";
import Sidebar from "../../../components/navigation/sidebar";
import apiUrl from "../../../config";
import {
  AddLoaderToBtn,
  AddTextToBtn,
  HideAlert,
  ShowAlert,
} from "../../../helpers/functions";

const AddTeacher = () => {
  const [subjects, setSubjects] = useState([]);

  const [alertMsg, setAlertMsg] = useState();

  const [teachers, setTeachers] = useState([]);

  const [teacherName, setTeacherName] = useState();
  const [rate, setRate] = useState();

  function FetchAllTeachers() {
    fetch(`${apiUrl}/teachers/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setTeachers(data);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
    } else {
      // user not authorised, navigate to login first
    }

    FetchAllTeachers();
  }, []);

  function OnSubmit() {
    AddLoaderToBtn("addBtn");

    const newTeacher = {
      name: teacherName,
      rate: rate,
    };

    fetch(`${apiUrl}/teachers/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTeacher),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          // fetch all teachers again
          FetchAllTeachers();

          setTeacherName("");
          setRate("");

          setTimeout(() => {
            HideAlert("success");
          }, 3000);
        } else {
          // show error alert
          setAlertMsg("Something went wrong. Please try again later");

          ShowAlert("error");

          setTimeout(() => {
            HideAlert("error");
          }, 3000);
        }

        AddTextToBtn("addBtn", "Add Subject");
      });
  }

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />

      {/* Sidebar */}
      <Sidebar />

      <div className='w-full h-screen overflow-auto bg-white p-10'>
        <h1 className='font-semibold text-3xl'>Teachers Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <button className='flex w-auto p-3 px-5 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'>
            <span className='p-1 mr-3'>
              <BsFillPlusSquareFill />
            </span>
            Add New Teacher
          </button>
        </div>

        <br />
        <br />

        <div className='w-full grid grid-cols-2 gap-10'>
          <div className='w-full'>
            <p className='py-1 text-gray-700'>Teacher Name</p>
            <input
              type='text'
              className='w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              onChange={(e) => {
                setTeacherName(e.target.value);
              }}
              value={teacherName}
              required
            />
          </div>

          <div className='w-full'>
            <p className='py-1 text-gray-700'>Percentage Rate</p>
            <input
              type='number'
              className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              onChange={(e) => {
                setRate(e.target.value);
              }}
              value={rate}
              required
            />
          </div>

          <div className='col-span-2 w-full flex items-end'>
            <button
              id='addBtn'
              onClick={OnSubmit}
              className='w-full p-3 bg-gray-800 text-white rounded-md transition-all hover:bg-gray-900 transform scale-100 active:scale-95'
            >
              Add Subject
            </button>
          </div>
        </div>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <button className='flex w-auto p-3 px-5 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'>
            <span className='p-1 mr-3'>
              <BsViewList />
            </span>
            View All Teachers
          </button>
        </div>

        <br />

        {teachers.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Name</th>
                <th className='pb-3'>Percentage Rate</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => {
                return (
                  <tr key={teacher.teacher_id}>
                    <td className='text-center py-2'>{teacher.teacher_id}</td>
                    <td className='text-center py-2'>{teacher.name}</td>
                    <td className='text-center py-2 text-sm'>
                      {teacher.rate} %
                    </td>
                    <td className='py-2'>
                      <div className='w-full flex space-x-3'>
                        <button className='w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white'>
                          Edit
                        </button>

                        <button className='w-full p-2 bg-red-600 hover:bg-red-700 rounded-md text-white'>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className='w-full p-5'>
            <div className='text-8xl text-gray-900'>
              <BsFillFilePersonFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No Teachers added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTeacher;
