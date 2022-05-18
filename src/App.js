import "./App.css";
import Welcome from "./pages/welcome/welcome";
import AddUser from "./pages/welcome/addUser";
import Login from "./pages/auth/login";
import Home from "./pages/dashboard/home";
import AddSubject from "./pages/dashboard/subjects/add";
import AddSection from "./pages/dashboard/sections/add";
import AddTeacher from "./pages/dashboard/teachers/add";
import AddStudent from "./pages/dashboard/students/add";
import CollectFees from "./pages/dashboard/fees/collect";
import AddEnrollment from "./pages/dashboard/enrollments/add";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        {/* Routes for the first time only */}
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/addUser' element={<AddUser />} />

        <Route path='/' index element={<Login />} />
        <Route path='/dashboard' index element={<Home />} />
        <Route path='/dashboard/subject' element={<AddSubject />} />
        <Route path='/dashboard/section' element={<AddSection />} />
        <Route path='/dashboard/teacher' element={<AddTeacher />} />
        <Route path='/dashboard/student' element={<AddStudent />} />
        <Route path='/dashboard/fees' element={<CollectFees />} />
        <Route path='/dashboard/enrolment' element={<AddEnrollment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
