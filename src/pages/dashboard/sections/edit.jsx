import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillPieChartFill,
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

const EditSection = () => {
  const navigate = useNavigate();

  const [sectionName, setSectionName] = useState("");
  const [subject, setSubject] = useState();
  const [teacher, setTeacher] = useState();
  const [studentClass, setStudentClass] = useState();

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
        setSections(data);
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

    FetchAllSubjects();
    FetchAllSections();
  }, []);

  useEffect(() => {
    if (subject && subject !== "Choose Subject") {
      FetchTeachersForTheSubject(subject);
    }
  }, [subject]);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    if (sectionName && subject && teacher && studentClass) {
      if (
        sectionName !== "" &&
        subject !== "Choose Subject" &&
        teacher !== "Select Teacher" &&
        studentClass !== "Select Class"
      ) {
        const newSection = {
          name: sectionName,
          subject_id: subject,
          teacher_id: teacher,
          studentClass: studentClass,
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
            if (data.result) {
              // show success alert as new subject created
              setAlertMsg(data.message);

              ShowAlert("success");

              // call to fetch all sections
              FetchAllSections();

              setSectionName("");
              setSubject("Choose Subject");
              setTeacher("Select Teacher");
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

            AddTextToBtn("addBtn", "Add Subject");
          });
      } else {
        setAlertMsg("Please Select All Fields First");

        ShowAlert("error");

        document.getElementById("addBtn").innerHTML = "Add Section";

        setTimeout(() => {
          HideAlert("error");
        }, 3000);
      }
    } else {
      setAlertMsg("Please Select All Fields First");

      ShowAlert("error");

      document.getElementById("addBtn").innerHTML = "Add Section";

      setTimeout(() => {
        HideAlert("error");
      }, 3000);
    }
  }

  const DeleteSection = (id) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      fetch(`${apiUrl}/sections/`, {
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

          FetchAllSections();

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
        <h1 className='font-semibold text-3xl'>Sections Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Section'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            {/* Section Name */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Section Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setSectionName(e.target.value);
                }}
                value={sectionName}
                placeholder='eg. Mathematics By Sir Hamza'
              />
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
                <option value={null}>Choose Subject</option>

                {/* Displaying subjects from the database */}
                {subjects.map((sub) => {
                  return (
                    <option key={sub.subject_id} value={sub.subject_id}>
                      {sub.name}
                    </option>
                  );
                })}
              </select>
            </div>

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
                <option>Select a subject first</option>
                {teachers.map((teach) => {
                  return (
                    <option key={teach.teacher_id} value={teach.teacher_id}>
                      {teach.name}
                    </option>
                  );
                })}
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
              <PrimaryBtn id='addBtn' type='submit' text='Add Section' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Sections'
          />
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
                <th className='pb-3'>Class</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => {
                return (
                  <tr key={section.section_id}>
                    <td className='text-left p-2'>{index + 1}</td>
                    <td className='text-left p-2'>{section.section}</td>
                    <td className='text-left p-2'>{section.teacher}</td>
                    <td className='text-left p-2'>{section.subject}</td>
                    <td className='text-left p-2'>{section.class}</td>
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
                              DeleteSection(section.section_id);
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

export default EditSection;
