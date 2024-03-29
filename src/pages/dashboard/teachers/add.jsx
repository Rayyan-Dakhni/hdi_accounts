import React, { useEffect } from "react";
import { useState } from "react";
import { BsViewList } from "react-icons/bs";

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

const AddTeacher = () => {
  const navigate = useNavigate();

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
  }, []);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    const newTeacher = {
      name: teacherName,
      rate: rate,
    };

    fetch(`${apiUrl}/teachers/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTeacher),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          setTeacherName("");
          setRate("");

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
      <InfoAlert id='info' heading='Info' alertMessage={alertMsg} />

      {/* Sidebar */}
      <Sidebar />

      <div className='w-full h-screen overflow-auto bg-white p-10'>
        <h1 className='font-semibold text-3xl'>Teachers Management</h1>
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
              <PrimaryBtn id='addBtn' type='submit' text='Add Teacher' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
