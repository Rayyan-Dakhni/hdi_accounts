import React, { useEffect } from "react";
import { useState } from "react";
import {
  BsFillFilePersonFill,
  BsFillPlusSquareFill,
  BsViewList,
} from "react-icons/bs";
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

const CollectFees = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [students, setStudents] = useState([]);
  const [feeCollections, setFeeCollections] = useState([]);

  const [student, setStudent] = useState();
  const [feePayable, setFeePayable] = useState("Select a student first");
  const [amount, setAmount] = useState();
  const [month, setMonth] = useState();

  function FetchAllStudents() {
    fetch(`${apiUrl}/students/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      });
  }

  function FetchAllFeeCollections() {
    fetch(`${apiUrl}/fees/`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setFeeCollections(data);
      });
  }

  function FetchStudentFeePayable(id) {
    fetch(`${apiUrl}/fees/getForStudent?id=${id}`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setFeePayable(data.feePayable);
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

    const FetchData = () => {
      FetchAllFeeCollections();
      FetchAllStudents();
    };

    FetchData();
  }, []);

  useEffect(() => {
    if (student) {
      FetchStudentFeePayable(student);
    }
  }, [student]);

  function OnSubmit(e) {
    e.preventDefault();

    AddLoaderToBtn("addBtn");

    const fees = {
      student_id: student,
      amount: amount,
      month: month,
    };

    fetch(`${apiUrl}/fees/collect`, {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fees),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // show success alert as new subject created
          setAlertMsg(data.message);

          ShowAlert("success");

          // fetch all fee collections again
          FetchAllFeeCollections();

          setStudent("Select student");
          setAmount(0);
          setFeePayable(0);
          setMonth("Select month");

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

        AddTextToBtn("addBtn", "Add Student");
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
        <h1 className='font-semibold text-3xl'>Fees Management</h1>
        <br />
        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsFillPlusSquareFill />}
            text='Collect Fees'
          />
        </div>

        <br />
        <br />

        <form onSubmit={OnSubmit}>
          <div className='w-full grid grid-cols-2 gap-10'>
            {/* Student Name */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Student Name</p>

              <select
                onChange={(e) => {
                  setStudent(e.target.value);
                }}
                value={student}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Student</option>
                {students.map((student) => {
                  return (
                    <option key={student.student_id} value={student.student_id}>
                      {student.fullName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Fee Payable */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Fee Payable</p>
              <input
                type='text'
                className='appearance-none w-full bg-gray-100 p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
                value={feePayable}
                required
                readOnly
              />
            </div>

            {/* Amount */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Amount</p>
              <Textfield
                type='number'
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                value={amount}
                placeholder='5000'
              />
            </div>

            {/* Month */}
            <div className='w-full'>
              <p className='py-1 text-gray-700'>Month</p>

              <select
                onChange={(e) => {
                  setMonth(e.target.value);
                }}
                value={month}
                className='appearance-none w-full bg-white p-3 px-5 border rounded-md focus:outline-none focus:border-gray-800'
              >
                <option>Select Month</option>
                <option value='1'>January</option>
                <option value='2'>February</option>
                <option value='3'>March</option>
                <option value='4'>April</option>
                <option value='5'>May</option>
                <option value='6'>June</option>
                <option value='7'>July</option>
                <option value='8'>August</option>
                <option value='9'>September</option>
                <option value='10'>October</option>
                <option value='11'>November</option>
                <option value='12'>December</option>
              </select>
            </div>

            <div className='col-span-2 w-full flex items-end'>
              <PrimaryBtn id='addBtn' type='submit' text='Collect Fees' />
            </div>
          </div>
        </form>

        <br />
        <br />

        <div className='w-full flex space-x-3 border-t border-b py-2'>
          <SecondaryBtn
            fullWidth={false}
            icon={<BsViewList />}
            text='View All Fee Collections'
          />
        </div>

        <br />

        {feeCollections.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className=''>
                <th className='pb-3'>Id</th>
                <th className='pb-3'>Student Name</th>
                <th className='pb-3'>Amount</th>
                <th className='pb-3'>Month</th>
                <th className='pb-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeCollections.map((fees) => {
                const date = new Date();

                date.setMonth(fees.month - 1);

                const month = date.toLocaleString("en-US", {
                  month: "long",
                });

                return (
                  <tr key={fees.fee_collection_id}>
                    <td className='text-center py-2'>
                      {fees.fee_collection_id}
                    </td>
                    <td className='text-center py-2'>{fees.fullName}</td>
                    <td className='text-center py-2'>{fees.amount}</td>
                    <td className='text-center py-2 text-sm'>{month}</td>
                    <td className='py-2'>
                      <div className='w-full flex space-x-3'>
                        <button className='w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white'>
                          Edit
                        </button>

                        <button className='w-full p-2 bg-red-600 hover:bg-red-700 rounded-md text-white'>
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
              <BsFillFilePersonFill className='mx-auto' />
            </div>
            <br />
            <h3 className='text-center'>No Students added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectFees;
