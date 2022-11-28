import React, { useEffect } from "react";
import { useState } from "react";
import { BsViewList } from "react-icons/bs";

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

const AddEnrollment = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [students, setStudents] = useState([]);
  const [sections, setSections] = useState([]);

  const [student, setStudent] = useState("");

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

  const GetSections = () => {
    fetch(`${apiUrl}/sections/?student_id=${student}`)
      .then((response) => response.json())
      .then((data) => {
        setSections(data);
        // const sections = document.getElementsByName("section");

        // sections.forEach((sect) => {
        //   let options = `
        //     <option>Select Section</option>
        //   `;

        //   data.forEach((dt) => {
        //     options += `<option value='${dt.section_id}'>${dt.subject} -- ${dt.section}</option>`;
        //   });

        //   sect.innerHTML = options;
        // });

        AddSectionsToAllSubjects(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (student && student !== "") {
      GetSections();
    }
  }, [student]);

  const AddEnrolmentSection = (e) => {
    e.preventDefault();

    const subjectsContainer = document.getElementById("multiple-subjects");

    const randomNumber = Math.floor(Math.random() * 100000);

    subjectsContainer.innerHTML += `
      <div id='section-${randomNumber}' class='w-full grid grid-cols-3 gap-4 border-t py-5'>

      <div class='w-full col-span-2'>
        <p class='py-1 text-gray-700'>Section</p>

        <select
          name='section'
          required
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
        >
          <option>Select Section</option>
        </select>
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Fees</p>

        <input
          type='number'
          name='fees'
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          placeholder='Fees'
          required
        />
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Duration</p>

        <select
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
        >
          <option value='Manually'>Select Manually</option>
        </select>
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Start Date</p>

        <input
          name='start-date'
          type='date'
          class='appearance-none w-full bg-white p-2.5 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          required
        />
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>End Date</p>

        <input
          name='end-date'
          type='date'
          class='appearance-none w-full bg-white p-2.5 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          required
        />
      </div>

      <div class='col-span-3'>
        <button type='button' onclick='document.getElementById("section-${randomNumber}").remove()' class='p-2 px-5 rounded bg-red-600 text-white uppercase text-sm float-right'>Remove</button>
      </div>
    </div>
    `;

    AddSectionsToAllSubjects(sections);
  };

  useEffect(() => {
    const subjectsContainer = document.getElementById("multiple-subjects");

    if (subjectsContainer.innerHTML) {
    } else {
      subjectsContainer.innerHTML += `
      <div id='section-1' class='w-full grid grid-cols-3 gap-4 border-t py-5'>

      <div class='w-full col-span-2'>
        <p class='py-1 text-gray-700'>Section</p>

        <select
          name='section'
          required
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
        >
          <option>Select Section</option>
        </select>
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Fees</p>

        <input
          type='number'
          name='fees'
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          placeholder='Fees'
          required
        />
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Duration</p>

        <select
          class='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
        >
          <option value='Manually'>Select Manually</option>
        </select>
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>Start Date</p>

        <input
          name='start-date'
          type='date'
          class='appearance-none w-full bg-white p-2.5 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          required
        />
      </div>

      <div class='w-full'>
        <p class='py-1 text-gray-700'>End Date</p>

        <input
          name='end-date'
          type='date'
          class='appearance-none w-full bg-white p-2.5 px-5 border rounded-md focus:outline-none focus:border-gray-800'
          required
        />
      </div>
    </div>
    `;
    }
  }, []);

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

    AddLoaderToBtn("enrol-student-btn");

    const sections = document.getElementsByName("section");
    const fees = document.getElementsByName("fees");
    const startDates = document.getElementsByName("start-date");
    const endDates = document.getElementsByName("end-date");

    const enrolments = [];

    for (let i = 0; i < sections.length; i++) {
      enrolments.push({
        section: sections[i].value,
        fees: fees[i].value,
        start_date: startDates[i].value,
        end_date: endDates[i].value,
      });
    }

    const enrolment = {
      student_id: student,
      enrolments: enrolments,
    };

    fetch(`${apiUrl}/enrolments/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrolment),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          setStudent("");

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

        AddTextToBtn("enrol-student-btn", "Enrol Student");
      })
      .catch((err) => console.log(err.response));
  }

  const AddSectionsToAllSubjects = (data) => {
    const sections = document.getElementsByName("section");

    console.log(sections);
    console.log(data);

    if (data.length > 0) {
      sections.forEach((sect) => {
        let options = `
              <option>Select Section</option>
            `;

        data.forEach((dt) => {
          options += `<option value='${dt.section_id}'>${dt.subject} -- ${dt.section}</option>`;
        });

        sect.innerHTML = options;
      });

      console.log("Added Sections");
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
        <h1 className='font-semibold text-3xl'>Enrolments Management</h1>
        <br />
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Students'
            onClick={() => navigate("/dashboard/student/view")}
          />
        </div>

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-3 gap-4 pt-5'>
            {/* Student */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Student</p>

              <select
                onChange={(e) => {
                  setStudent(e.target.value);
                }}
                value={student}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Student</option>
                {students.map((student) => {
                  return (
                    <option key={student.student_id} value={student.student_id}>
                      {student.fullName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='col-span-2 flex w-full items-end'>
              <PrimaryBtn
                onClick={AddEnrolmentSection}
                type='button'
                text='Add More'
              />
            </div>
          </div>

          <br />

          <div id='multiple-subjects'></div>

          <br />

          <PrimaryBtn
            id='enrol-student-btn'
            type='submit'
            text='Enrol Student'
          />
        </form>

        <br />
        <br />
      </div>
    </div>
  );
};

export default AddEnrollment;
