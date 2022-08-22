import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillCollectionFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";

import { AiFillEdit, AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../../components/alerts/error";
import SuccessAlert from "../../../components/alerts/success";
import InfoAlert from "../../../components/alerts/info";
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

const ViewSubjects = () => {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");

  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSubjectId, setEditSubjectId] = useState();

  const [subjects, setSubjects] = useState([]);

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

  useEffect(() => {
    if (!IsAdminLoggedIn()) {
      setAlertMsg("Not Authorised. Please Login First.");

      ShowAlert("info");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }

    FetchAllSubjects();
  }, []);

  const EditSubject = (e) => {
    e.preventDefault();

    const updatedSubject = {
      id: editSubjectId,
      name: editSubjectName,
    };

    fetch(`${apiUrl}/subjects/`, {
      method: "put",
      mode: "cors",
      body: JSON.stringify(updatedSubject),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        // hello

        HideModal("edit-modal");

        setAlertMsg("Subject Updated");
        ShowAlert("success");

        FetchAllSubjects();

        setTimeout(() => {
          HideAlert("success");
        }, 2000);
      });
  };

  function DeleteSubject(id) {
    if (
      window.confirm("Are you sure you want to delete this subject?") === true
    ) {
      fetch(`${apiUrl}/subjects`, {
        method: "delete",
        mode: "cors",
        body: JSON.stringify({ id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAlertMsg(data.message);

          ShowAlert("success");

          FetchAllSubjects();

          setTimeout(() => {
            HideAlert("success");
          }, 2000);
        });
    } else {
    }
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
        <h1 className='font-semibold text-3xl'>Subjects Management</h1>
        <br />

        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            onClick={() => navigate("/dashboard/subjects/add")}
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Subject'
          />
        </div>

        <br />

        {subjects.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Subject Name</th>
                <th className='pb-3'>Teachers Assigned</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => {
                console.log(subject);
                return (
                  <tr key={subject.subject_id}>
                    <td className='text-center py-2'>{index + 1}</td>
                    <td className='text-center py-2'>{subject.name}</td>
                    <td className='text-center py-2'>
                      {subject.teacher_names.map((teacher) => {
                        return <p className='py-1'>{teacher}</p>;
                      })}

                      {subject.teacher_names.length > 0
                        ? ""
                        : "No teachers assigned yet"}
                    </td>
                    <td className='py-2'>
                      <div className='w-full flex justify-center items-center space-x-3'>
                        <div className='relative group'>
                          <div className='absolute w-full text-xs text-center bg-gray-900 text-white -top-8 shadow-md p-1 rounded-md transition-all invisible transform scale-50 group-hover:visible group-hover:scale-100'>
                            Edit
                          </div>
                          <button
                            onClick={() => {
                              navigate("/dashboard/subjects/edit", {
                                state: {
                                  subject: subject,
                                },
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
                            onClick={() => {
                              DeleteSubject(subject.subject_id);
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
              <BsFillCollectionFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No subjects added yet</h3>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <div
        id='edit-modal'
        className='absolute w-1/3 border transition-all left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-50 invisible bg-white rounded-md shadow-md p-5'
      >
        <div className='flex w-full'>
          <h3 className='font-semibold text-lg'>Edit Subject</h3>

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

        <form onSubmit={EditSubject}>
          <div className='w-full grid grid-cols-1 gap-4'>
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Subject Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setEditSubjectName(e.target.value);
                }}
                value={editSubjectName}
              />
            </div>

            <div className='w-full flex items-end'>
              <PrimaryBtn
                id='edit-subject-btn'
                type='submit'
                text='Edit Subject'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewSubjects;
