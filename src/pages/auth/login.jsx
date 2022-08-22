import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/alerts/error";
import SuccessAlert from "../../components/alerts/success";
import PrimaryBtn from "../../components/buttons/primary";
import Textfield from "../../components/inputs/textfield";
import apiUrl from "../../config";
import {
  AddLoaderToBtn,
  AddRippleToButton,
  AddTextToBtn,
  HideAlert,
  ShowAlert,
} from "../../helpers/functions";

import Logo from "../../assets/logo.PNG";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [alertMsg, setAlertMsg] = useState();

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("loginBtn");

    const credentials = {
      username: username,
      password: password,
    };

    fetch(`${apiUrl}/auth/login/`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        setAlertMsg(data.message);

        if (data.userFound === 1) {
          if (data.token) {
            // show success alert as the user is authenticated
            ShowAlert("success");

            sessionStorage.setItem("token", data.token);

            setTimeout(() => {
              // navigate to dashboard
              navigate("/dashboard", { replace: true });
            }, 2000);
          } else {
            // show error alert as the password was incorrect
            ShowAlert("error");

            console.log("show alert called");

            setTimeout(() => {
              AddTextToBtn("loginBtn", "Login");
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className='w-screen min-h-screen flex flex-col sm:flex-row space-y-5 justify-center items-center bg-white overflow-auto'>
      {/* Alerts */}
      <SuccessAlert id='success' heading='Success' alertMessage={alertMsg} />
      <ErrorAlert id='error' heading='Error' alertMessage={alertMsg} />

      <div className='w-full bg-white'>
        <img src={Logo} alt='Logo' className='w-32 sm:w-80 mx-auto' />
      </div>

      <div className='w-full p-5 sm:p-10'>
        <h1 className='font-semibold text-2xl sm:text-4xl text-center font-serif'>
          Welcome Back
        </h1>
        <h3 className='text-gray-500 text-center text-xs sm:text-md'>
          Please login to continue
        </h3>

        <br />

        <form className='w-full px-5 lg:px-10 xl:px-32' onSubmit={OnSubmit}>
          {/* Username */}
          <div className='w-full'>
            <p className='py-1 text-sm text-gray-600 uppercase'>Username</p>
            <Textfield
              type='text'
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
          </div>

          {/* Password */}
          <div className='w-full'>
            <p className='py-1 mt-2 text-sm text-gray-600 uppercase'>
              Password
            </p>
            <Textfield
              type='password'
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </div>

          <div
            onClick={() => {
              // navigate to forget password page
            }}
            className='w-full mt-2 flex justify-end text-gray-500 hover:text-blue-500 cursor-pointer'
          >
            Forgot Password?
          </div>

          <br />

          <div className='w-full'>
            <PrimaryBtn
              onClick={(e) => {
                AddRippleToButton(e);
              }}
              id='loginBtn'
              type='submit'
              text='Login'
            />

            {/* <br />
            <br />
            <button
              id=''
              type='button'
              className='relative overflow-hidden w-full p-3 bg-gray-800 text-white rounded-md transition-all hover:bg-gray-900 transform scale-100'
              onClick={(e) => {
                AddRippleToButton(e);

                AddLoaderToBtn("demoBtn");
              }}
            >
              <div id='demoBtn'>Login</div>
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
