import { Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CreateProfile from "./pages/CreateProfile";
import ForgetEmail from "./pages/ForgetEmail";
import ChangePassword from "./pages/Resetpassword";
import OtpSet from "./pages/OtpSet";
import Profile from "./pages/Employee/Profile";
import Navbar from "./components/Navbar";
import EmployeeJob from "./pages/Employee/EmployeeJob";
import EmployeeeJobDetail from "./pages/Employee/EmployeeeJobDetail";
import EmployeeJobs from "./pages/Employee/EmployeeJobs";
import JobDetails from "./pages/Employee/JobDetails";
import Dashboardnav from "./DashboardLayout/Dashboardnav";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerJobs from "./pages/Employer/EmployerJob/EmployerJobs";
import EmployerJobDetail from "./pages/Employer/EmployerJob/EmployerJobDetail";
import EmployerPostJob from "./pages/Employer/EmployerJob/EmployerPostJob";
import EmployerEditJob from "./pages/Employer/EmployerJob/EmployerEditJob";
import EmployerApplicants from "./pages/Employer/EmployerApplicants/EmployerApplicants";
import EmployerApplicantDetail from "./pages/Employer/EmployerApplicants/EmployerApplicantDetail";
import EmployerMessages from "./pages/Employer/EmployerMessages/EmployerMessages";
import EmployerMessageDetail from "./pages/Employer/EmployerMessages/EmployerMessageDetail";
import EmployerSetting from "./pages/Employer/EmployerSetting";
import EmployerProfessionalDetail from "./pages/Employer/EmployerProfessionalDetail";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminJobs from "./pages/Admin/AdminJob/AdminJobs";
import AdminJobDetail from "./pages/Admin/AdminJob/AdminJobDetail";
import AdminMessages from "./pages/Admin/AdminMessages";
import AdminMessageDetail from "./pages/Admin/AdminMessageDetail";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminHealthCareProfesionals from "./pages/Admin/AdminHealthCareProfesionals";
import AdminHealthCareProfesionalDetail from "./pages/Admin/AdminHealthCareProfesionalDetail";
import AdminEmployers from "./pages/Admin/AdminEmployers";
import AdminEmployerDetail from "./components/AdminEmployerTabs/AdminEmployerDetail";

export const ProtectedRoute = ({ children, allowedTypes }) => {
  const user = JSON.parse(localStorage.getItem("USER_STRING"));
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const routes = [
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/forget-email",
    element: <ForgetEmail />,
  },
  {
    path: "/changepassword",
    element: <ChangePassword />,
  },
  {
    path: "/otpset/:id",
    element: <OtpSet />,
  },
  {
    path: "/create-profile",
    element: (
      <ProtectedRoute>
        <CreateProfile />
      </ProtectedRoute>
    ),
  },
  // Professional Routes
  {
    path: "/",
    element: (
      <ProtectedRoute allowedTypes={["P"]}>
        <Navbar />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "find-employee/job",
        element: <EmployeeJob />,
      },
      {
        path: "find-employee/job/detail/:id",
        element: <EmployeeeJobDetail />,
      },
      {
        path: "employee/job",
        element: <EmployeeJobs />,
      },
      {
        path: "job-details/:id",
        element: <JobDetails />,
      },
    ],
  },
  // Employer Routes
  {
    path: "/employer",
    element: (
      <ProtectedRoute allowedTypes={["F"]}>
        <Dashboardnav type="employer" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <EmployerDashboard />,
      },
      {
        path: "professional/:id",
        element: <EmployerProfessionalDetail />,
      },
      {
        path: "jobs",
        element: <EmployerJobs />,
      },
      {
        path: "jobs/:id",
        element: <EmployerJobDetail />,
      },
      {
        path: "jobs/postjob",
        element: <EmployerPostJob />,
      },
      {
        path: "jobs/editjob",
        element: <EmployerEditJob />,
      },
      {
        path: "applicants",
        element: <EmployerApplicants />,
      },
      {
        path: "applicants/:id",
        element: <EmployerApplicantDetail />,
      },
      {
        path: "messages",
        element: <EmployerMessages />,
      },
      {
        path: "messages/:id",
        element: <EmployerMessageDetail />,
      },
      {
        path: "settings",
        element: <EmployerSetting />,
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedTypes={["A"]}>
        <Dashboardnav type="admin" />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "healthcareprofesionals",
        element: <AdminHealthCareProfesionals />,
      },
      {
        path: "healthcareprofesionals/:id",
        element: <AdminHealthCareProfesionalDetail />,
      },
      {
        path: "employer",
        element: <AdminEmployers />,
      },
      {
        path: "employer/:id",
        element: <AdminEmployerDetail />,
      },
      {
        path: "jobs",
        element: <AdminJobs />,
      },
      {
        path: "jobs/:id",
        element: <AdminJobDetail />,
      },
      {
        path: "messages",
        element: <AdminMessages />,
      },
      {
        path: "messages/:id",
        element: <AdminMessageDetail />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
  // Catch all route
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]; 