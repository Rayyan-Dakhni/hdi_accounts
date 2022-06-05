import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillCollectionFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
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
  IsAdminLoggedIn,
  ShowAlert,
} from "../../../helpers/functions";

const AddSubject = () => {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");

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

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addSubBtn");

    const newSubject = {
      name: subjectName,
    };

    fetch(`${apiUrl}/subjects/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSubject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          setSubjectName("");

          FetchAllSubjects();

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

        AddTextToBtn("addSubBtn", "Add Subject");
      });
  }

  function DeleteSubject(id) {
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
        <h1 className='font-semibold text-3xl'>Subjects Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Add New Subject'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Subject Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setSubjectName(e.target.value);
                }}
                value={subjectName}
                placeholder='eg. Mathematics'
              />
            </div>

            <div className='w-full flex items-end'>
              <PrimaryBtn id='addSubBtn' type='submit' text='Add Subject' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Subject'
          />
        </div>

        <br />

        {subjects.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Subject Name</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => {
                return (
                  <tr key={subject.subject_id}>
                    <td className='text-center py-2'>{subject.subject_id}</td>
                    <td className='text-center py-2'>{subject.name}</td>
                    <td className='py-2'>
                      <div className='w-full flex space-x-3'>
                        <button
                          onClick={() => {
                            DeleteSubject(subject.subject_id);
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
              <BsFillCollectionFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No subjects added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSubject;
