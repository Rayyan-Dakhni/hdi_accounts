import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsGridFill,
  BsFillCollectionFill,
  BsFillFilePersonFill,
  BsFillPieChartFill,
  BsBookFill,
  BsFillPlusSquareFill,
  BsViewList,
  BsFillPersonFill,
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

const AddSection = () => {
  const [sectionName, setSectionName] = useState();
  const [subject, setSubject] = useState();
  const [teacher, setTeacher] = useState();

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);

  const [alertMsg, setAlertMsg] = useState();

  function FetchAllSubjects() {
    fetch(`${apiUrl}/subjects/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setSubjects(data);
      });
  }

  function FetchTeachersForTheSubject(id) {
    fetch(`${apiUrl}/teachers/getForSubject?subject_id=${id}`, {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setTeachers(data);
      });
  }

  function FetchAllSections() {
    fetch(`${apiUrl}/sections/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setSections(data);
      });
  }

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
    } else {
      // user not authorised, navigate to login first
    }

    FetchAllSubjects();
    FetchAllSections();
  }, []);

  useEffect(() => {
    FetchTeachersForTheSubject(subject);
  }, [subject]);

  function OnSubmit() {
    AddLoaderToBtn("addBtn");

    const newSection = {
      name: sectionName,
      subject_id: subject,
      teacher_id: teacher,
    };

    fetch(`${apiUrl}/sections/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSection),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          // call to fetch all sections
          FetchAllSections();

          setSectionName("");
          setSubject("Choose Subject");
          setTeacher("Select a subject first");

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
        <h1 className='font-semibold text-3xl'>Sections Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <button className='flex w-auto p-3 px-5 bg-white hover:bg-gray-200 rounded-md transition-all transform scale-100 active:scale-95'>
            <span className='p-1 mr-3'>
              <BsFillPlusSquareFill />
            </span>
            Add New Section
          </button>
        </div>

        <br />
        <br />

        <div className='w-full grid grid-cols-2 gap-10'>
          <div className='w-full'>
            <p className='py-1 text-gray-700'>Section Name</p>
            <input
              type='text'
              className='w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              onChange={(e) => {
                setSectionName(e.target.value);
              }}
              value={sectionName}
              required
            />
          </div>

          <div className='w-full'>
            <p className='py-1 text-gray-700'>Subject</p>
            <select
              onChange={(e) => {
                setSubject(e.target.value);
              }}
              value={subject}
              className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
            >
              <option>Choose Subject</option>

              {/* Displaying subjects from the database */}
              {subjects.map((sub) => {
                return <option value={sub.subject_id}>{sub.name}</option>;
              })}
            </select>
          </div>

          <div className='w-full'>
            <p className='py-1 text-gray-700'>Teacher</p>
            <select
              onChange={(e) => {
                setTeacher(e.target.value);
              }}
              value={teacher}
              className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
            >
              <option>Select a subject first</option>
              {teachers.map((teach) => {
                return <option value={teach.teacher_id}>{teach.name}</option>;
              })}
            </select>
          </div>

          <div className='w-full flex items-end'>
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
            View All Sections
          </button>
        </div>

        <br />

        {sections.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Section Name</th>
                <th className='pb-3'>Teachers</th>
                <th className='pb-3'>Subject</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => {
                return (
                  <tr>
                    <td className='text-center py-2'>{section.section_id}</td>
                    <td className='text-center py-2'>{section.section}</td>
                    <td className='text-center py-2'>{section.teacher}</td>
                    <td className='text-center py-2'>{section.subject}</td>
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
              <BsFillPieChartFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No sections added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSection;
