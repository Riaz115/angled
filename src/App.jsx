import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "react-phone-number-input/style.css";
import CreateProfile from "./pages/CreateProfile";
import Dashboardnav from "./DashboardLayout/Dashboardnav";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerJobs from "./pages/Employer/EmployerJob/EmployerJobs";
import EmployerApplicants from "./pages/Employer/EmployerApplicants/EmployerApplicants";
import EmployerApplicantDetail from "./pages/Employer/EmployerApplicants/EmployerApplicantDetail";
import EmployerMessages from "./pages/Employer/EmployerMessages/EmployerMessages";
import EmployerSetting from "./pages/Employer/EmployerSetting";
import EmployerJobDetail from "./pages/Employer/EmployerJob/EmployerJobDetail";
import Profile from "./pages/Employee/Profile";
import Navbar from "./components/Navbar";
import EmployerPostJob from "./pages/Employer/EmployerJob/EmployerPostJob";
import EmployerMessageDetail from "./pages/Employer/EmployerMessages/EmployerMessageDetail";
import EmployeeJob from "./pages/Employee/EmployeeJob";
import EmployeeeJobDetail from "./pages/Employee/EmployeeeJobDetail";
import EmployeeJobs from "./pages/Employee/EmployeeJobs";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminJobs from "./pages/Admin/AdminJob/AdminJobs";
import AdminMessages from "./pages/Admin/AdminMessages";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminHealthCareProfesionals from "./pages/Admin/AdminHealthCareProfesionals";
import AdminEmployers from "./pages/Admin/AdminEmployers";
import AdminJobDetail from "./pages/Admin/AdminJob/AdminJobDetail";
import AdminHealthCareProfesionalDetail from "./pages/Admin/AdminHealthCareProfesionalDetail";
import AdminMessageDetail from "./pages/Admin/AdminMessageDetail";
import ForgetEmail from "./pages/ForgetEmail";
import OtpSet from "./pages/OtpSet";
import ChangePassword from "./pages/Resetpassword";
import JobDetails from "./pages/Employee/JobDetails";
import { addUser, selectUser } from "./redux/userSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { encryptKey } from "./config";
import { decryptUserData } from "./api/reuse";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthToken } from "./api/apiClient";
import EmployerEditJob from "./pages/Employer/EmployerJob/EmployerEditJob";
import EmployerProfessionalDetail from "./pages/Employer/EmployerProfessionalDetail";
import AdminEmployerDetail from "./components/AdminEmployerTabs/AdminEmployerDetail";
import { toast } from "react-toastify";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#000e2f',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1>Something went wrong!</h1>
          <p>Error: {this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: 'white',
              color: '#000e2f',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log("App component is rendering!");

  return (
    <div style={{
      backgroundColor: '#000e2f',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h1>🎉 App Component is Working!</h1>
      <p>If you can see this, the App component is rendering properly.</p>
      
      <div style={{
        background: 'red',
        color: 'white',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px'
      }}>
        This should be a red box
      </div>
      
      <button 
        onClick={() => alert('App component is working!')}
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          color: '#000e2f',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Test App Button
      </button>
      
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'green',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        ✅ App Loaded
      </div>
    </div>
  );
}

export default App;
