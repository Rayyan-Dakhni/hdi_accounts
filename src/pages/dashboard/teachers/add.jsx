import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";

import { AiFillEdit, AiFillDelete, AiOutlineClose } from "react-icons/ai";

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
  HideModal,
  IsAdminLoggedIn,
  ShowAlert,
  ShowModal,
} from "../../../helpers/functions";

const AddTeacher = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [teachers, setTeachers] = useState([]);

  const [teacherName, setTeacherName] = useState("");
  const [rate, setRate] = useState(0);

  const [editTeacherId, setEditTeacherId] = useState();
  const [editTeacherName, setEditTeacherName] = useState("");
  const [editRate, setEditRate] = useState(0);

  function FetchAllTeachers() {
    fetch(`${apiUrl}/teachers/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setTeachers(data);
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

    FetchAllTeachers();
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

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

  const DeleteTeacher = (id) => {
    if (
      window.confirm("Are you sure you want to delete this teacher?") === true
    ) {
      console.log("Deleting teacher...");

      fetch(`${apiUrl}/teachers/`, {
        method: "delete",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          FetchAllTeachers();
        });
    } else {
    }
  };

  const EditTeacher = (e) => {
    e.preventDefault();

    const updatedTeacher = {
      id: editTeacherId,
      name: editTeacherName,
      rate: editRate,
    };

    fetch(`${apiUrl}/teachers/`, {
      method: "put",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTeacher),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        HideModal("edit-modal");

        setAlertMsg("Teacher Updated");
        ShowAlert("success");

        setTimeout(() => {
          HideAlert("success");
        }, 3000);

        FetchAllTeachers();
      });
  };

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />
      <InfoAlert id='info' heading='Info' alertMessage={alertMsg} />

      {/* Sidebar */}
      <Sidebar />

      <div className='w-full h-screen overflow-auto bg-white p-10'>
        <h1 className='font-semibold text-3xl'>Teachers Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Teacher'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Teacher Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setTeacherName(e.target.value);
                }}
                value={teacherName}
                placeholder='eg. Sir Hamza'
              />
            </div>

            <div className='w-full'>
              <p className='py-1 text-gray-700'>Percentage Rate</p>
              <Textfield
                type='number'
                onChange={(e) => {
                  setRate(e.target.value);
                }}
                value={rate}
                placeholder='eg. 75'
              />
            </div>

            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Add Teacher' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Teachers'
          />
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
              {teachers.map((teacher, index) => {
                return (
                  <tr key={teacher.teacher_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{teacher.name}</td>
                    <td className='text-center py-2 text-sm'>
                      {teacher.rate} %
                    </td>
                    <td className='py-2'>
                      <div className='w-full flex justify-center items-center space-x-3'>
                        <div className='relative group'>
                          <div className='absolute w-full text-xs text-center bg-gray-900 text-white -top-8 shadow-md p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Edit
                          </div>
                          <button
                            onClick={() => {
                              setEditTeacherName(teacher.name);
                              setEditRate(teacher.rate);
                              setEditTeacherId(teacher.teacher_id);
                              ShowModal("edit-modal");
                            }}
                            className='w-10 h-10 text-center text-blue-600 hover:bg-gray-200 rounded-full'
                          >
                            <AiFillEdit className='mx-auto' />
                          </button>
                        </div>

                        <div className='relative group'>
                          <div className='absolute text-xs w-auto -top-8 -left-1 bg-gray-900 text-white shadow-lg p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Delete
                          </div>
                          <button
                            type='button'
                            onClick={() => {
                              DeleteTeacher(teacher.teacher_id);
                            }}
                            className='w-10 h-10 text-center text-red-600 hover:bg-gray-200 rounded-full'
                          >
                            <AiFillDelete className='mx-auto' />
                          </button>
                        </div>
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

      {/* Edit Teacher */}
      <div
        id='edit-modal'
        className='absolute w-1/3 border transition-all left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-50 invisible bg-white rounded-md shadow-md p-5'
      >
        <div className='flex w-full'>
          <h3 className='font-semibold text-lg'>Edit Teacher</h3>

          <button
            onClick={() => {
              HideModal("edit-modal");
            }}
            className='ml-auto p-2 hover:bg-gray-200 rounded-full'
          >
            <AiOutlineClose />
          </button>
        </div>

        <br />

        <form onSubmit={EditTeacher}>
          <div className='w-full grid grid-cols-1 gap-4'>
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Teacher Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setEditTeacherName(e.target.value);
                }}
                value={editTeacherName}
              />
            </div>

            <div className='w-full'>
              <p className='py-1 text-gray-700'>Percentage Rate</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setEditRate(e.target.value);
                }}
                value={editRate}
              />
            </div>

            <div className='w-full flex items-end'>
              <PrimaryBtn
                id='edit-subject-btn'
                type='submit'
                text='Edit Teacher'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
