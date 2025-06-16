import "./App.css";
import { Route, Routes } from "react-router-dom";
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
  console.log(user, encryptKey, "this is user data for store user data");

  useEffect(() => {
    if (user) {
      setAuthToken(user?.access);
      if (window.location.pathname === "/") {
        if (user?.profile_completed) {
          if (user.type === "P") {
            navigate("/find-employee/job");
          } else if (user.type === "F") {
            navigate("/employer/dashboard");
          } else {
            navigate("/admin/dashboard");
          }
        } else {
          if (user) {
            navigate("/create-profile");
          }
        }
      }
    } else {
      const storedData = localStorage.getItem("USER_STRING");
      if (storedData) {
        const data = JSON.parse(storedData);
        const adminData = decryptUserData(data, encryptKey);
        console.log(adminData, "this is adminData of user");
        setAuthToken(adminData?.access);
        dispatch(addUser(adminData));
        if (window.location.pathname === "/") {
          if (user && user?.profile_completed) {
            if (user.type === "P") {
              navigate("/find-employee/job");
            } else if (user.type === "F") {
              navigate("/employer/dashboard");
            } else {
              navigate("/admin/dashboard");
            }
          } else {
            if (user) {
              navigate("/create-profile");
            }
          }
        }
      } else {
        localStorage.removeItem("USER_STRING");
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
  }, [user, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/create-profile" element={<CreateProfile />} />
      <Route path="/forget-email" element={<ForgetEmail />} />
      <Route path="/changepassword" element={<ChangePassword />} />
      <Route path="/otpset/:id" element={<OtpSet />} />
      {user?.type === "P" && (
        <Route element={<Navbar />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/find-employee/job" element={<EmployeeJob />} />
          <Route
            path="/find-employee/job/detail/:id"
            element={<EmployeeeJobDetail />}
          />
          <Route path="/employee/job/" element={<EmployeeJobs />} />
          <Route path="/job-details/:id" element={<JobDetails />} />
        </Route>
      )}

      {/* employer routes */}

      <Route element={<Dashboardnav type={"employer"} />}>
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route
          path="/employer/professional/:id"
          element={<EmployerProfessionalDetail />}
        />

        <Route path="/employer/jobs" element={<EmployerJobs />} />
        <Route path="/employer/jobs/:id" element={<EmployerJobDetail />} />
        <Route path="/employer/jobs/postjob" element={<EmployerPostJob />} />
        <Route path="/employer/jobs/editjob" element={<EmployerEditJob />} />
        <Route path="/employer/applicants" element={<EmployerApplicants />} />
        <Route
          path="/employer/applicants/:id"
          element={<EmployerApplicantDetail />}
        />
        <Route path="/employer/messages" element={<EmployerMessages />} />
        <Route
          path="/employer/messages/:id"
          element={<EmployerMessageDetail />}
        />
        <Route path="/employer/settings" element={<EmployerSetting />} />
      </Route>
      {/* admin routes */}
      <Route element={<Dashboardnav type={"admin"} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/healthcareprofesionals"
          element={<AdminHealthCareProfesionals />}
        />
        <Route
          path="/admin/healthcareprofesionals/:id"
          element={<AdminHealthCareProfesionalDetail />}
        />
        <Route path="/admin/employer" element={<AdminEmployers />} />
        <Route path="/admin/employer/:id" element={<AdminEmployerDetail />} />
        <Route path="/admin/jobs" element={<AdminJobs />} />
        <Route path="/admin/jobs/:id" element={<AdminJobDetail />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/messages/:id" element={<AdminMessageDetail />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
