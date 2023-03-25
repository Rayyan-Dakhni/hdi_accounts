import React, { useEffect } from "react";
import { useState } from "react";

import { AiFillBackward } from "react-icons/ai";

import { useLocation, useNavigate } from "react-router-dom";
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

const EditTeacher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [alertMsg, setAlertMsg] = useState();

  const [teacherName, setTeacherName] = useState("");
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (!IsAdminLoggedIn()) {
      setAlertMsg("Not Authorised. Please Login First. Redirecting...");

      ShowAlert("info");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }

    if (!location.state) {
      navigate("/dashboard/teacher/view", { replace: true });
    }

    console.log(location.state);

    setTeacherName(location.state.name);
    setRate(location.state.rate);
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    const updatedTeacher = {
      id: location.state.teacher_id,
      name: teacherName,
      rate: rate,
    };

    fetch(`${apiUrl}/teachers/`, {
      method: "put",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTeacher),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setAlertMsg("Teacher Updated");
        ShowAlert("success");

        setTimeout(() => {
          navigate("/dashboard/teacher/view", { replace: true });
        }, 1500);
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
        <h1 className='font-semibold text-3xl'>Teachers Management</h1>
        <br />
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            onClick={() => {
              navigate("/dashboard/teacher/view");
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
              <p className='py-1 text-gray-700'>Teacher Name</p>
              <Textfield
                type='text'
                onChange={(e) => {
                  setTeacherName(e.target.value);
                }}
                value={teacherName}
                placeholder='eg. Sir Hamza'
              />
            </div>

            <div className='w-full'>
              <p className='py-1 text-gray-700'>Percentage Rate</p>
              <Textfield
                type='number'
                onChange={(e) => {
                  setRate(e.target.value);
                }}
                value={rate}
                placeholder='eg. 75'
              />
            </div>

            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Edit Teacher' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacher;
