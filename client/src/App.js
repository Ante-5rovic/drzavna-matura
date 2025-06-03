import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './theme.css'; 

//Pages
import Home from "./Pages/HomePage/Home";
import NotFound from "./Pages/ErrorPages/NotFound/NotFound";
import StillInDevelopment from "./Pages/ErrorPages/StillInDevelopment/StillInDevelopment";
import ScrollToTop from "./Components/_OtherAppRelatedComponents/ScrollToTop";
import Login from "./Pages/AuntentificationPages/LoginPage/Login";
import Register from "./Pages/AuntentificationPages/RegisterPage/Register";
import MaturaList from "./Pages/MaturaListPage/MaturaList";
import Profile from "./Pages/AuntentificationPages/ProfilePage/Profile";
import Exam from "./Pages/ExamPages/Exam";
import ExamMasterDetail from "./Pages/AdminPages/ExamMasterDetail"; 
import SubjectManagement from './Components/SubjectManagmentComponent/SubjectManagement';
import AdminDashboard from './Pages/AdminPages/AdminDashboard';
import EmailVerificationPage from './Components/VerifyEmailComponent/EmailVerificationPage';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        {/*TO DO napraviti visestruke rute na istu komponentu na bolji nacin*/}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home.html" element={<Home />} />
        <Route path="/StillInDevelopment" element={<StillInDevelopment />} />
        <Route path="/StillInDevelopment.html" element={<StillInDevelopment />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} /> 
        <Route path="/user-profil" element={<Profile />} />{/*pogledati ovo dali sada baca error jer sam pobrisa jedan /*/}
        <Route path="/matura/:imePredmeta" element={<MaturaList />} />
        <Route path="/matura/:imePredmeta/:razinaPredmeta" element={<MaturaList />} />
        <Route path="/exam/:imeId" element={<Exam/>} />{/*/za sada samo test*/}
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminDashboard element={<AdminDashboard/>} />} />
        <Route path="/admin/exams" element={<ExamMasterDetail />} />
        <Route path="/admin/subjects" element={<SubjectManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
