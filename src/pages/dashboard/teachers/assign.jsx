import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
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

  const subjectsMenu = useRef(null);

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
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    const subject_ids = [];

    const checkboxes = document.getElementsByName("subjects-checkboxes");

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        subject_ids.push(checkbox.value);
      }
    });

    const teacherAssign = {
      teacher_id: teacher,
      subject_ids: subject_ids,
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
          // clearing previous selected fields
          checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              checkbox.checked = false;
            }
          });

          setTeacher("");

          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

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
    if (
      window.confirm(
        "Are you sure you want to delete this teachers assignment?"
      )
    ) {
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

          setTimeout(() => {
            HideAlert("success");
          }, 3000);
        });
    }
  }

  // closing subjects menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (subjectsMenu.current && !subjectsMenu.current.contains(e.target)) {
        const menu = document.getElementById("subjects-menu");
        menu.style.display = "none";
      }
    });
  }, []);

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
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Teachers'
            onClick={() => {
              navigate("/dashboard/teacher/view");
            }}
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
            <div className='w-full relative'>
              <p className='py-1 text-gray-700'>Subject</p>

              <button
                type='button'
                className='p-3 border w-full text-left px-5 rounded-md'
                onClick={(e) => {
                  const menu = document.getElementById("subjects-menu");

                  if (
                    menu.style.display === "none" ||
                    menu.classList.contains("hidden")
                  ) {
                    menu.classList.remove("hidden");
                    menu.style.display = "block";
                  } else {
                    menu.style.display = "none";
                  }
                }}
              >
                Select Subjects
              </button>

              <div
                id='subjects-menu'
                ref={subjectsMenu}
                className='absolute z-20 top-24 left-0 w-full h-80 border bg-white rounded-md shadow-md p-3 overflow-auto hidden'
              >
                {subjects.map((sub) => {
                  return (
                    <label className='p-2 rounded-md flex items-center space-x-2 hover:bg-gray-100'>
                      <input
                        type='checkbox'
                        className='w-5 h-5 flex-none'
                        value={sub.subject_id}
                        name='subjects-checkboxes'
                      />
                      <span className=''>{sub.name}</span>
                    </label>
                  );
                })}
              </div>

              {/* <select
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
              </select> */}
            </div>

            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Assign Teacher' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTeacher;
