import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
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

const ViewStudent = () => {
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

  const DeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`${apiUrl}/students/`, {
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

          setAlertMsg(data.message);
          ShowAlert("success");

          FetchAllStudents();

          setTimeout(() => {
            HideAlert("success");
          }, 3000);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
        <h1 className='font-semibold text-3xl'>Students Management</h1>
        <br />
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Student'
            onClick={() => navigate("/dashboard/student/add")}
          />

          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Enrol Student'
            onClick={() => navigate("/dashboard/enrolment")}
          />
        </div>

        <br />
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
                <th className='pb-3 w-28'>Actions</th>
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
                    <td className='py-2 text-center'>
                      <div className='w-full flex space-x-3'>
                        <div className='relative group w-auto'>
                          <div className='absolute text-xs w-auto -top-8 left-1 bg-gray-900 text-white shadow-lg p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Edit
                          </div>
                          <button
                            onClick={() => {}}
                            className='w-10 h-10 text-center text-blue-600 hover:bg-gray-200 rounded-full'
                          >
                            <AiFillEdit className='mx-auto' />
                          </button>
                        </div>

                        <div className='relative group w-auto'>
                          <div className='absolute text-xs w-auto -top-8 -left-1 bg-gray-900 text-white shadow-lg p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Delete
                          </div>
                          <button
                            onClick={() => {
                              DeleteStudent(student.student_id);
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
            <h3 className='text-center'>No Students added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudent;
