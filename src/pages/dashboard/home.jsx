import React, { useEffect } from "react";
import { useState } from "react";
import { BsFillPeopleFill, BsFillCreditCardFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import InfoAlert from "../../components/alerts/info";
import AnalyticsCard from "../../components/cards/analytics";
import Sidebar from "../../components/navigation/sidebar";
import apiUrl from "../../config";
import { IsAdminLoggedIn, ShowAlert } from "../../helpers/functions";

const Home = () => {
  const navigate = useNavigate();

  const [alertMsg, setAlertMsg] = useState();

  const [feesRemaining, setFeesRemaining] = useState();
  const [percentageCollected, setPercentageCollected] = useState();
  const [totalStudents, setTotalStudents] = useState();

  const [students, setStudents] = useState([]);

  function GetFeesRemaining() {
    fetch(`${apiUrl}/fees/getFeesRemaining`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setFeesRemaining(
          data.remaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
        setPercentageCollected(data.percentageCollected);
      });
  }

  function GetAllStudentsWithFeeStatus() {
    fetch(`${apiUrl}/fees/getAll`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setStudents(data);
      });
  }

  function GetTotalStudents() {
    fetch(`${apiUrl}/students/total`, {
      method: "get",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        setTotalStudents(data.total);
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

    GetAllStudentsWithFeeStatus();
  }, []);

  useEffect(() => {
    GetFeesRemaining();
    GetTotalStudents();
  }, []);

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Sidebar */}
      <Sidebar />

      {/* Alerts */}
      <InfoAlert id='info' heading='Info' alertMessage={alertMsg} />

      <div className='p-10 h-screen overflow-auto w-full'>
        <h1 className='font-semibold text-3xl'>Dashboard</h1>

        <br />
        <br />

        <div className='grid grid-cols-3 gap-4'>
          {/* Total Number of Students */}
          <AnalyticsCard
            icon={<BsFillPeopleFill />}
            text={`${totalStudents} Students`}
            footerText='Total number or student enroled'
          />

          {/* Fees Remaining */}
          <AnalyticsCard
            icon={<BsFillCreditCardFill />}
            text={`Rs. ${feesRemaining} Remaining`}
            footerText='Amount of fees remaining'
          />

          {/* Percentage Collected */}
          <AnalyticsCard
            icon={<BsFillCreditCardFill />}
            text={`${percentageCollected}% Collected`}
            footerText='Percentage of total fees collected'
          />
        </div>

        <br />

        <h2 className='font-semibold text-2xl'>Due Fees List</h2>
        <br />
        {students.length > 0 ? (
          <table className='w-full table-auto'>
            <thead>
              <tr className='uppercase border-b-2 text-sm'>
                <th className='p-3 text-left'>Id</th>
                <th className='p-3 text-left'>Student Name</th>
                <th className='p-3 text-left'>Phone Number</th>
                <th className='p-3 text-left'>Level</th>
                <th className='p-3 text-left'>Class</th>
                <th className='p-3 text-left'>Total</th>
                <th className='p-3 text-left'>Paid</th>
                <th className='p-3 text-left'>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => {
                const remaining =
                  parseInt(student.total) - parseInt(student.collected) || 0;

                console.log(remaining);

                if (remaining > 0) {
                  return (
                    <tr
                      className='text-gray-500 font-light border-b-2'
                      key={index}
                    >
                      <td className='text-left p-3 rounded-md'>{index + 1}</td>
                      <td className='text-left text-black p-3 font-semibold rounded-md'>
                        {student.fullName}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.phoneNo}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.level}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.class}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        Rs. {student.total}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        Rs. {student.collected}
                      </td>
                      <td className='text-left text-red-600 font-semibold p-3 rounded-md'>
                        Rs. {remaining}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr
                      key={index}
                      className='border-b-2 text-gray-500 font-light'
                    >
                      <td className='text-left p-3 rounded-md'>{index + 1}</td>
                      <td className='text-left text-black p-3 font-semibold rounded-md'>
                        {student.fullName}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.phoneNo}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.level}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        {student.class}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        Rs. {student.total}
                      </td>
                      <td className='text-left p-3 rounded-md'>
                        Rs. {student.collected}
                      </td>
                      <td className='text-left text-black font-semibold p-3 rounded-md'>
                        Rs. {remaining}
                      </td>
                    </tr>
                  );
                }
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

export default Home;
