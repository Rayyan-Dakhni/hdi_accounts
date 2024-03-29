import React, { useEffect } from "react";
import { useState } from "react";
import { BsViewList } from "react-icons/bs";

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

  const [alertMsg, setAlertMsg] = useState();

  useEffect(() => {
    if (!IsAdminLoggedIn()) {
      setAlertMsg("Not Authorised. Please Login First.");

      ShowAlert("info");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
    }
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

          setTimeout(() => {
            HideAlert("success");
          }, 2000);
        } else {
          // show error alert
          setAlertMsg("Something went wrong. Please try again later");

          ShowAlert("error");

          setTimeout(() => {
            HideAlert("error");
          }, 2000);
        }

        AddTextToBtn("addSubBtn", "Add Subject");
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
        <div className='w-full flex justify-end space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            onClick={() => {
              navigate("/dashboard/subjects/view");
            }}
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Subjects'
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
      </div>
    </div>
  );
};

export default AddSubject;
