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
import Sidebar from "../../../components/navigation/sidebar";
import apiUrl from "../../../config";
import {
  AddLoaderToBtn,
  AddTextToBtn,
  HideAlert,
  IsAdminLoggedIn,
  ShowAlert,
} from "../../../helpers/functions";

const AssignTeacher = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assigns, setAssigns] = useState([]);

  const [teacher, setTeacher] = useState();
  const [subject, setSubject] = useState();

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

  function FetchAllSubjects() {
    fetch(`${apiUrl}/subjects/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data);
      });
  }

  function FetchAllAssigns() {
    fetch(`${apiUrl}/assign/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setAssigns(data);
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
    FetchAllSubjects();
    FetchAllAssigns();
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    const teacherAssign = {
      teacher_id: teacher,
      subject_id: subject,
    };

    fetch(`${apiUrl}/assign/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherAssign),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          // fetch all teachers again
          FetchAllAssigns();

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

  function DeleteAssignment(id) {
    fetch(`${apiUrl}/assign/`, {
      method: "delete",
      mode: "cors",
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAlertMsg(data.message);

        ShowAlert("success");

        FetchAllAssigns();

        setTimeout(() => {
          HideAlert("success");
        }, 3000);
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
        <h1 className='font-semibold text-3xl'>Assign Teachers</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Assign Teacher'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            {/* Teacher */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Teacher</p>

              <select
                onChange={(e) => {
                  setTeacher(e.target.value);
                }}
                value={teacher}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Teacher</option>
                {teachers.map((teacher, index, arr) => {
                  return (
                    <option key={teacher.teacher_id} value={teacher.teacher_id}>
                      {teacher.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Subject */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Subject</p>

              <select
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
                value={subject}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Subject</option>
                {subjects.map((subject) => {
                  return (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Assign Teacher' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Teacher Assigns'
          />
        </div>

        <br />

        {assigns.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Teacher</th>
                <th className='pb-3'>Subject</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assigns.map((assign, index) => {
                return (
                  <tr key={assign.teacher_subject_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{assign.teacher_name}</td>
                    <td className='text-center py-2'>{assign.subject_name}</td>
                    <td className='py-2'>
                      <div className='w-full flex space-x-3'>
                        <button
                          onClick={() => {
                            DeleteAssignment(assign.teacher_subject_id);
                          }}
                          className='w-full p-2 bg-red-600 hover:bg-red-700 rounded-md text-white'
                        >
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

export default AssignTeacher;
