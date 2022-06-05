import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import apiUrl from "../../config";

import SuccessAlert from "../../components/alerts/success";
import ErrorAlert from "../../components/alerts/error";
import {
  AddLoaderToBtn,
  AddTextToBtn,
  ShowAlert,
} from "../../helpers/functions";

const AddUser = () => {
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [alertMsg, setAlertMsg] = useState();

  function OnSubmit() {
    AddLoaderToBtn("submitBtn");

    const newAdmin = {
      name: name,
      username: username,
      password: password,
    };

    fetch(`${apiUrl}/auth/register`, {
      method: "post",
      mode: "cors",
      body: JSON.stringify(newAdmin),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAlertMsg(data.message);

        if (data.error) {
          // could not register

          ShowAlert("error");

          AddTextToBtn("submitBtn", "Next");
        } else {
          // admin registered

          ShowAlert("success");

          setTimeout(() => {
            // navigate to login screen
            navigate("/login", { replace: true });
          }, 3000);
        }
      });
  }

  return (
    <div className='w-screen min-h-screen bg-white p-10'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />

      <h1 className='text-center font-semibold text-4xl font-serif'>
        Let's get you started
      </h1>
      <br />
      <br />
      <div className='w-2/3 h-auto mx-auto grid grid-cols-2 gap-10'>
        <div>
          <p className='py-1'>Name</p>
          <input
            type='text'
            className='w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>

        <div>
          <p className='py-1'>Username</p>
          <input
            type='text'
            className='w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            required
          />
        </div>

        <div>
          <p className='py-1'>Password</p>
          <input
            type='password'
            className='w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>

        <div className='row-span-2'>
          <h3 className='font-semibold'>Password Guidlines</h3>
          <p className='ml-5'>
            <ol className='list-disc'>
              <li>Atleast 8 characters long</li>
              <li>Atleast 1 capital letter</li>
              <li>Atleast 1 special character for eg. $</li>
              <li>Atleast 1 number</li>
            </ol>
          </p>
        </div>

        <div className='flex items-end'>
          <button
            id='submitBtn'
            onClick={OnSubmit}
            className='p-3 w-full bg-gradient-to-r from-blue-800 to-blue-500 text-white font-sans font-semibold text-lg tracking-wider rounded-lg transition-all active:scale-95'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
