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
import { useEffect } from "react";
import { encryptKey } from "./config";
import { decryptUserData } from "./api/reuse";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthToken } from "./api/apiClient";
import EmployerEditJob from "./pages/Employer/EmployerJob/EmployerEditJob";
import EmployerProfessionalDetail from "./pages/Employer/EmployerProfessionalDetail";
import AdminEmployerDetail from "./components/AdminEmployerTabs/AdminEmployerDetail";
import { toast } from "react-toastify";

function App() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = () => {
      const storedData = localStorage.getItem("USER_STRING");
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          const adminData = decryptUserData(data, encryptKey);
          setAuthToken(adminData?.access);
          dispatch(addUser(adminData));
        } catch (error) {
          console.error("Error decrypting user data:", error);
          localStorage.removeItem("USER_STRING");
          navigate("/");
        }
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  const ProtectedRoute = ({ children, allowedTypes }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }

    if (allowedTypes && !allowedTypes.includes(user.type)) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forget-email" element={<ForgetEmail />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/otpset/:id" element={<OtpSet />} />
      
      <Route
        path="/create-profile"
        element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        }
      />

      {/* Professional Routes */}
      <Route
        element={
          <ProtectedRoute allowedTypes={["P"]}>
            <Navbar />
          </ProtectedRoute>
        }
      >
        <Route path="/profile" element={<Profile />} />
        <Route path="/find-employee/job" element={<EmployeeJob />} />
        <Route path="/find-employee/job/detail/:id" element={<EmployeeeJobDetail />} />
        <Route path="/employee/job/" element={<EmployeeJobs />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
      </Route>

      {/* Employer Routes */}
      <Route
        element={
          <ProtectedRoute allowedTypes={["F"]}>
            <Dashboardnav type="employer" />
          </ProtectedRoute>
        }
      >
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/professional/:id" element={<EmployerProfessionalDetail />} />
        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/jobs/:id" element={<EmployerJobDetail />} />
        <Route path="/employer/jobs/postjob" element={<EmployerPostJob />} />
        <Route path="/employer/jobs/editjob" element={<EmployerEditJob />} />
        <Route path="/employer/applicants" element={<EmployerApplicants />} />
        <Route path="/employer/applicants/:id" element={<EmployerApplicantDetail />} />
        <Route path="/employer/messages" element={<EmployerMessages />} />
        <Route path="/employer/messages/:id" element={<EmployerMessageDetail />} />
        <Route path="/employer/settings" element={<EmployerSetting />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute allowedTypes={["A"]}>
            <Dashboardnav type="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/healthcareprofesionals" element={<AdminHealthCareProfesionals />} />
        <Route path="/admin/healthcareprofesionals/:id" element={<AdminHealthCareProfesionalDetail />} />
        <Route path="/admin/employer" element={<AdminEmployers />} />
        <Route path="/admin/employer/:id" element={<AdminEmployerDetail />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/:id" element={<AdminJobDetail />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/messages/:id" element={<AdminMessageDetail />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
