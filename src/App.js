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
import AssignTeacher from "./pages/dashboard/teachers/assign";
import Payrol from "./pages/dashboard/payrol/view";
import TeacherPayroll from "./pages/dashboard/payrol/teacher";
import ViewSubjects from "./pages/dashboard/subjects/view";
import EditSubject from "./pages/dashboard/subjects/edit";

function App() {
  return (
    <BrowserRouter basename='/'>
      <Routes>
        {/* Routes for the first time only */}
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/addUser' element={<AddUser />} />

        <Route path='/' index element={<Login />} />
        <Route path='/dashboard' index element={<Home />} />

        {/* Subjects Routes */}
        <Route path='/dashboard/subjects/add' element={<AddSubject />} />
        <Route path='/dashboard/subjects/view' element={<ViewSubjects />} />
        <Route path='/dashboard/subjects/edit' element={<EditSubject />} />

        <Route path='/dashboard/section' element={<AddSection />} />
        <Route path='/dashboard/teacher' element={<AddTeacher />} />
        <Route path='/dashboard/assign' element={<AssignTeacher />} />
        <Route path='/dashboard/student' element={<AddStudent />} />
        <Route path='/dashboard/fees' element={<CollectFees />} />
        <Route path='/dashboard/enrolment' element={<AddEnrollment />} />
        <Route path='/dashboard/payroll' element={<Payrol />} />
        <Route path='/dashboard/payroll/teacher' element={<TeacherPayroll />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
