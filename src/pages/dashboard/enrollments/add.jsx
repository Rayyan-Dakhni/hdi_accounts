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

const AddEnrollment = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [enrolments, setEnrolments] = useState([]);

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);

  const [student, setStudent] = useState("");
  const [subject, setSubject] = useState("");
  const [fees, setFees] = useState("");
  const [section, setSection] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    FetchAllStudents();
    FetchAllSubjects();
  }, []);

  useEffect(() => {
    if (subject !== "") {
      FetchSections();
    }
  }, [subject]);

  const FetchSections = () => {
    fetch(`${apiUrl}/sections/get/subject?id=${subject}`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setSections(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function FetchAllTeachersForSubject(id) {
    fetch(`${apiUrl}/teachers/getForSubject?subject_id=${id}`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setTeachers(data);
      });
  }

  function FetchAllSectionsForSubjectAndTeacher(subject_id, teacher_id) {
    fetch(
      `${apiUrl}/sections/getForSubjectAndTeacher?subject_id=${subject_id}&teacher_id=${teacher_id}`,
      {
        method: "get",
        mode: "cors",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSections(data);
      });
  }

  function FetchAllEnrolments() {
    fetch(`${apiUrl}/enrolments/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setEnrolments(data);
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

    // FetchAllEnrolments();

    // FetchAllSubjects();
    // FetchAllStudents();
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("enrol-student-btn");

    const enrolment = {
      student_id: student,
      fees: fees,
      section_id: section,
      start_date: startDate,
      end_date: endDate,
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
          setSubject("");
          setFees(0);
          setSection("");
          setStartDate("");
          setEndDate("");

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
              <PrimaryBtn type='button' text='Add More' />
            </div>
          </div>

          <br />

          <div className='w-full grid grid-cols-3 gap-4 border-t py-5'>
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
                {subjects.map((sub) => {
                  return (
                    <option key={sub.subject_id} value={sub.subject_id}>
                      {sub.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Fees */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Fees</p>

              <Textfield
                type='number'
                placeholder='Fees'
                value={fees}
                onChange={(e) => {
                  setFees(e.target.value);
                }}
              />
            </div>

            {/* Section */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Section</p>

              <select
                onChange={(e) => {
                  setSection(e.target.value);
                }}
                value={section}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Section</option>
                {sections.map((sect) => {
                  return (
                    <option key={sect.section_id} value={sect.section_id}>
                      {sect.name} - {sect.class}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Duration */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Duration</p>

              <select
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
                value={duration}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option value='Manually'>Select Manually</option>
              </select>
            </div>

            {/* Start Date */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Start Date</p>

              <Textfield
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>End Date</p>

              <Textfield
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <br />

          <PrimaryBtn
            id='enrol-student-btn'
            type='submit'
            text='Enrol Student'
          />
        </form>

        <br />
        <br />

        {/* <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Student Enrolments'
          />
        </div>

        <br />

        {enrolments.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Student</th>
                <th className='pb-3'>Subject</th>
                <th className='pb-3'>Teacher</th>
                <th className='pb-3'>Section</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrolments.map((enrolment, index) => {
                return (
                  <tr key={enrolment.enrollment_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{enrolment.student}</td>
                    <td className='text-center py-2'>{enrolment.subject}</td>
                    <td className='text-center py-2'>{enrolment.teacher}</td>
                    <td className='text-center py-2 text-sm'>
                      {enrolment.section}
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
            <h3 className='text-center'>No student enrolments yet</h3>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AddEnrollment;
