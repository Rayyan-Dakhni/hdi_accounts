import React, { useEffect } from "react";
import { useState } from "react";
import { AiFillBackward } from "react-icons/ai";

import { useLocation, useNavigate } from "react-router-dom";
import ErrorAlert from "../../../components/alerts/error";
import SuccessAlert from "../../../components/alerts/success";
import InfoAlert from "../../../components/alerts/info";
import PrimaryBtn from "../../../components/buttons/primary";
import SecondaryBtn from "../../../components/buttons/secondary";
import Textfield from "../../../components/inputs/textfield";
import Sidebar from "../../../components/navigation/sidebar";
import apiUrl from "../../../config";
import { IsAdminLoggedIn, ShowAlert } from "../../../helpers/functions";

const EditSubject = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [id, setId] = useState();
  const [name, setName] = useState("");

  const [alertMsg, setAlertMsg] = useState();

  useEffect(() => {
    if (!IsAdminLoggedIn()) {
      setAlertMsg("Not Authorised. Please Login First.");

      ShowAlert("info");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }

    if (location.state.subject) {
      setId(location.state.subject.subject_id);
      setName(location.state.subject.name);
    }
  }, []);

  const OnSubmit = (e) => {
    e.preventDefault();

    const updatedSubject = {
      id: id,
      name: name,
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

        setAlertMsg("Subject Updated");
        ShowAlert("success");

        setTimeout(() => {
          navigate("/dashboard/subjects/view");
        }, 2000);
      });
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
        <h1 className='font-semibold text-3xl'>Subjects Management</h1>
        <br />
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            onClick={() => {
              navigate("/dashboard/subjects/view");
            }}
            fullWidth={false}
            icon={<AiFillBackward />}
            text='Go Back'
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
                  setName(e.target.value);
                }}
                value={name}
                placeholder='eg. Mathematics'
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

        <br />
        <br />
      </div>
    </div>
  );
};

export default EditSubject;
