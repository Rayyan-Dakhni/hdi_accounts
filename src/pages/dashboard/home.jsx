import React, { useEffect } from "react";
import {
  BsGridFill,
  BsFillCollectionFill,
  BsFillFilePersonFill,
  BsFillPieChartFill,
  BsBookFill,
} from "react-icons/bs";
import Sidebar from "../../components/navigation/sidebar";

const Home = () => {
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      const token = sessionStorage.getItem("token");
    } else {
      // user not authorised, navigate to login first
    }
  }, []);

  return (
    <div className='w-screen min-h-screen flex'>
      {/* Sidebar */}
      <Sidebar />
    </div>
  );
};

export default Home;
