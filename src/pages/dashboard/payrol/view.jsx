import React, { useEffect } from "react";
import { useState } from "react";
import { BsFillPeopleFill, BsFillPlusSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import InfoAlert from "../../../components/alerts/info";
import PrimaryBtn from "../../../components/buttons/primary";
import SecondaryBtn from "../../../components/buttons/secondary";

import Sidebar from "../../../components/navigation/sidebar";
import apiUrl from "../../../config";
import { IsAdminLoggedIn, ShowAlert } from "../../../helpers/functions";

const Payrol = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [payrolls, setPayrolls] = useState([]);

  function GetPayrolls() {
    fetch(`${apiUrl}/payroll/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setPayrolls(data);
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

    GetPayrolls();
  }, []);

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Alerts */}
      <InfoAlert id='info' heading='Info' alertMessage={alertMsg} />

      <div className='p-10 h-screen overflow-auto w-full'>
        <h1 className='font-semibold text-3xl'>Payrolls</h1>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='View Teacher Payrolls'
          />
        </div>
        <br />
        {payrolls.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className='uppercase border-b-2 text-sm'>
                <th className='p-3 text-left'>Id</th>
                <th className='p-3 text-left'>Teacher Name</th>
                <th className='p-3 text-left'>Rate</th>
                <th className='p-3 text-left'>Total Fees</th>
                <th className='p-3 text-left'>Amount to Pay</th>
                <th className='p-3 text-left'>Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll, index) => {
                return (
                  <tr
                    className='text-gray-500 font-light border-b-2'
                    key={index}
                  >
                    <td className='text-left p-3 rounded-md'>{index + 1}</td>
                    <td className='text-left text-black p-3 font-semibold rounded-md'>
                      {payroll.name}
                    </td>
                    <td className='text-left p-3 rounded-md'>
                      {payroll.rate}%
                    </td>
                    <td className='text-left font-semibold text-green-600 p-3 rounded-md'>
                      Rs. {payroll.amount_collected}
                    </td>
                    <td className='text-left font-semibold text-red-600 p-3 rounded-md'>
                      Rs. {payroll.amount_to_pay}
                    </td>
                    <td className='text-left font-semibold text-red-600 p-3 rounded-md'>
                      <PrimaryBtn
                        type='button'
                        text='View Reciept'
                        onClick={() => {}}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className='w-full p-5'>
            <div className='text-8xl text-gray-900'>
              <BsFillPeopleFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No Students added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payrol;
