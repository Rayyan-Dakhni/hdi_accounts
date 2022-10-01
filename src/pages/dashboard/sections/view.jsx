import React, { useEffect } from "react";
import { useState } from "react";
import { BsFillPieChartFill, BsFillPlusSquareFill } from "react-icons/bs";
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

const ViewSection = () => {
  const navigate = useNavigate();

  const [sectionName, setSectionName] = useState("");
  const [subject, setSubject] = useState();
  const [teacher, setTeacher] = useState();
  const [studentClass, setStudentClass] = useState();

  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);

  const [alertMsg, setAlertMsg] = useState();

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

    FetchAllSections();
  }, []);

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

        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Sections'
            onClick={() => {
              navigate("/dashboard/section/add");
            }}
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

export default ViewSection;
