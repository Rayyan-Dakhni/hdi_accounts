import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../../components/alerts/error";
import InfoAlert from "../../../components/alerts/info";
import SuccessAlert from "../../../components/alerts/success";
import PrimaryBtn from "../../../components/buttons/primary";
import SecondaryBtn from "../../../components/buttons/secondary";
import Textfield from "../../../components/inputs/textfield";
import Sidebar from "../../../components/navigation/sidebar";
import apiUrl from "../../../config";
import {
  AddLoaderToBtn,
  AddTextToBtn,
  HideAlert,
  IsAdminLoggedIn,
  ShowAlert,
} from "../../../helpers/functions";

const AddStudent = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [level, setLevel] = useState("Select Level");
  const [studentClass, setStudentClass] = useState("Select Class");

  function FetchAllStudents() {
    fetch(`${apiUrl}/students/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      });
  }

  useEffect(() => {
    if (!IsAdminLoggedIn()) {
      setAlertMsg("Not Authorised. Please Login First. Redirecting...");

      ShowAlert("info");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }

    FetchAllStudents();
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    const newStudent = {
      name: name,
      phoneNo: phoneNo,
      level: level,
      studentClass: studentClass,
    };

    fetch(`${apiUrl}/students/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          // fetch all teachers again
          FetchAllStudents();

          setName("");
          setPhoneNo("");
          setLevel("Select Level");
          setStudentClass("Select Class");

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

        AddTextToBtn("addBtn", "Add Student");
      });
  }

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />
      <InfoAlert id='info' heading='Info' alertMessage={alertMsg} />

      {/* Sidebar */}
      <Sidebar />

      <div className='w-full h-screen overflow-auto bg-white p-10'>
        <h1 className='font-semibold text-3xl'>Students Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Student'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            {/* Student Name */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Student Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                placeholder='eg. Rayyan Dakhni'
              />
            </div>

            {/* Phone Number */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Phone Number</p>
              <Textfield
                type='number'
                onChange={(e) => {
                  setPhoneNo(e.target.value);
                }}
                value={phoneNo}
                placeholder='eg. 3312221445'
              />
            </div>

            {/* Level */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Level</p>

              <select
                onChange={(e) => {
                  setLevel(e.target.value);
                }}
                value={level}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
                required
              >
                <option>Select Level</option>
                <option value='O'>O Levels</option>
                <option value='A'>A Levels</option>
              </select>
            </div>

            {/* Class */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Class</p>

              <select
                onChange={(e) => {
                  setStudentClass(e.target.value);
                }}
                value={studentClass}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Class</option>
                <option value='9'>9</option>
                <option value='10'>10</option>
                <option value='11'>11</option>
                <option value='As'>As</option>
                <option value='A2'>A2</option>
              </select>
            </div>

            {/* Submit Btn */}
            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Add Student' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Students'
          />
        </div>

        <br />

        {students.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Name</th>
                <th className='pb-3'>Phone No</th>
                <th className='pb-3'>Level</th>
                <th className='pb-3'>Class</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                return (
                  <tr key={student.student_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{student.fullName}</td>
                    <td className='text-center py-2'>{student.phoneNo}</td>
                    <td className='text-center py-2 text-sm'>
                      {student.level}
                    </td>
                    <td className='text-center py-2'>{student.class}</td>
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
            <h3 className='text-center'>No Students added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
