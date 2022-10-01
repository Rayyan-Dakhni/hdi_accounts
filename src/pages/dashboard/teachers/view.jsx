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

const ViewTeacher = () => {
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

        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Teacher'
            onClick={() => {
              navigate("/dashboard/teacher/add", { replace: false });
            }}
          />

          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Assign Subject'
            onClick={() => {
              navigate("/dashboard/assign", { replace: false });
            }}
          />
        </div>

        <br />

        {teachers.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Name</th>
                <th className='pb-3'>Rate (%)</th>
                <th className='pb-3'>Subjects</th>
                <th className='pb-3'>Sections</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => {
                teacher.subjects = teacher.subjects.filter(
                  (value, index, self) => {
                    return self.indexOf(value) === index;
                  }
                );
                return (
                  <tr key={teacher.teacher_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{teacher.name}</td>
                    <td className='text-center py-2 text-sm'>
                      {teacher.rate} %
                    </td>
                    <td className='text-center py-2 text-sm'>
                      {teacher.subjects.map((subject) => {
                        return <p className='py-1'>{subject}</p>;
                      })}
                    </td>
                    <td className='text-center py-2 text-sm'>
                      {teacher.sections.map((section) => {
                        return <p className='py-1'>{section}</p>;
                      })}
                    </td>
                    <td className='py-2'>
                      <div className='w-full flex justify-center items-center space-x-3'>
                        <div className='relative group'>
                          <div className='absolute w-full text-xs text-center bg-gray-900 text-white -top-8 shadow-md p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Edit
                          </div>
                          <button
                            onClick={() => {
                              navigate("/dashboard/teacher/edit", {
                                state: {
                                  ...teacher,
                                },
                                replace: true,
                              });
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
    </div>
  );
};

export default ViewTeacher;
