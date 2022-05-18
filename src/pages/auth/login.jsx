import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/alerts/error";
import SuccessAlert from "../../components/alerts/success";
import apiUrl from "../../config";
import {
  AddLoaderToBtn,
  AddTextToBtn,
  HideAlert,
  ShowAlert,
} from "../../helpers/functions";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const [alertMsg, setAlertMsg] = useState();

  function OnSubmit() {
    AddLoaderToBtn("loginBtn");

    const credentials = {
      username: username,
      password: password,
    };

    fetch(`${apiUrl}/auth/login`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setAlertMsg(data.message);

        if (data.userFound == 1) {
          if (data.token) {
            // show success alert as the user is authenticated
            ShowAlert("success");

            sessionStorage.setItem("token", data.token);

            setTimeout(() => {
              // navigate to dashboard
              navigate("/dashboard", { replace: true });
            }, 3000);
          } else {
            // show error alert as the password was incorrect
            ShowAlert("error");

            AddTextToBtn("loginBtn", "Login");

            setTimeout(() => {
              HideAlert("error");
            }, 3000);
          }
        } else {
          // show error alert as no admin with the following credentials was found
          ShowAlert("error");

          AddTextToBtn("loginBtn", "Login");

          setTimeout(() => {
            HideAlert("error");
          }, 3000);
        }
      });
  }

  return (
    <div className='w-screen min-h-screen flex flex-col space-y-5 justify-center items-center bg-white'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />

      <h1 className='font-semibold text-6xl font-serif'>Welcome Back</h1>
      <h3 className='text-gray-500 text-lg'>Please login to continue</h3>
      <div></div>
      <div className='w-1/4'>
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
      <div className='w-1/4'>
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

      <div
        onClick={() => {
          // navigate to forget password page
        }}
        className='w-1/4 flex justify-end text-gray-500 hover:text-blue-500 cursor-pointer'
      >
        Forgot Password?
      </div>

      <div className='w-1/4'>
        <button
          id='loginBtn'
          onClick={OnSubmit}
          className='p-3 w-full bg-gradient-to-r from-blue-800 to-blue-500 text-white font-sans font-semibold text-lg tracking-wider rounded-lg transition-all active:scale-95'
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
