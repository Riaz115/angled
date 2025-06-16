import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import App from "../../../components/Autogoogle/Autogooglecomplete";
import apiClient from "../../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import { toast } from "react-toastify";

const EmployerEditJob = () => {
  const location = useLocation();
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    role: "",
    start_date: "",
    end_date: "",
    shift: "",
    location: "",
    latitude: "",
    longitude: "",
    salary: "",
    department: "",
  });
  const user = useSelector(selectUser);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    type: "",
    role: "",
    start_date: "",
    end_date: "",
    shift: "",
    location: "",
    salary: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [departments, setDepartment] = useState();
  const [roles, setRole] = useState();
  const navigate = useNavigate();
  const jobId = location?.state?.id;

  const getdepartment = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/facility/api/department/`);
      if (response.ok) {
        setDepartment(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of getdepartment data response");
      setLoading(false);
    }
  };

  const getrole = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/role/`);
      if (response.ok) {
        setRole(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of getrole data response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getdepartment();
      getrole();
    }
  }, [user]);

  const getJobData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/facility/api/job/${jobId}/`);
      if (response.ok) {
        const jobData = response?.data;

        setFormData({
          title: jobData?.title || "",
          description: jobData?.description || "",
          type: jobData?.type.value || "",
          role: jobData?.role || "",
          start_date: jobData?.start_date || "",
          end_date: jobData?.end_date || "",
          shift: jobData?.shift.value || "",
          location: jobData?.location || "",
          latitude: jobData?.latitude || "",
          longitude: jobData?.longitude || "",
          salary: jobData?.salary || "",
          department: jobData?.department || "",
        });
        setAddress(jobData?.location || "");
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job data response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      getJobData();
    }
  }, [user, jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuillChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    // Validate form fields
    if (!formData.title) formErrors.title = "Job Title is required";
    if (!formData.description)
      formErrors.description = "Job Description is required";
    if (!formData.type) formErrors.type = "Job Type is required";
    if (!formData.role) formErrors.role = "Role is required";
    if (!formData.start_date) formErrors.startTime = "Start Time is required";
    if (!formData.end_date) formErrors.endTime = "End Time is required";
    if (!formData.shift) formErrors.shift = "Shift is required";
    if (!formData.location) formErrors.location = "Location is required";
    if (!formData.salary) formErrors.salary = "Salary is required";
    if (!formData.department) formErrors.department = "Department is required";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted", formData);

      try {
        setLoading(true);
        const response = await apiClient.patch(
          `/facility/api/job/${jobId}/`,
          formData
        );

        if (response.ok) {
          console.log("Job successfully Updated", response.data);
          navigate("/employer/jobs");
          toast.success("Job successfully Updated!");

          setFormData({});
        } else {
          console.log("Error in response", response.data);
          // Optionally handle specific server errors
        }
        setLoading(false);
      } catch (error) {
        console.log("Error while Updated job data", error);
        setLoading(false);
      }
    } else {
      console.log("Form contains errors", formErrors);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="px-sm-5 p-4">
        <Typography className="fw-bold">Edit a Job</Typography>
      </Box>
      <Box
        className="px-sm-5 p-4 d-flex justify-content-center align-items-center bg-white"
        sx={{
          backgroundImage: `
  linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
  url('../../public/signatureBG.svg')
  `,
          backgroundPosition: "center ",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          overflow: "auto",
        }}
      >
        <Box
          component={"form"}
          sx={{
            width: {
              xs: "100%",
              sm: "80%",
              md: "70%",
              lg: "50%",
            },
          }}
          className="d-flex flex-column gap-4 mt-3 pb-5"
          onSubmit={handleSubmit}
        >
          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Job Title
            </Typography>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
            {errors.title && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.title}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Job Description
            </Typography>
            <ReactQuill
              value={formData.description}
              onChange={handleQuillChange}
              modules={modules}
              formats={formats}
              placeholder="Write your instructions here..."
            />
            {errors.description && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.description}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Job Role
            </Typography>
            <select
              name="department"
              value={formData.role}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  role: e.target.value,
                }))
              }
              className="form-select p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            {errors.role && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.role}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Job Type
            </Typography>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            >
              <option value="" disabled>
                Select Job Type
              </option>
              <option value="C">Contract</option>
              <option value="DH">Direct Hire</option>
              <option value="D">Diem</option>
            </select>
            {errors.type && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.type}
              </Alert>
            )}
          </Box>

          {/* <Box>
              <Typography sx={{ color: "#808080" }} className="fw-bold">
                Start Date
              </Typography>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control p-2"
                style={{ backgroundColor: "#f6f6f6" }}
              />
              {errors.startDate && (
                <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                  {errors.startDate}
                </Alert>
              )}
            </Box> */}

          <Box className="d-flex align-items-center gap-3">
            <Box className="w-100">
              <Typography sx={{ color: "#808080" }} className="fw-bold">
                Start Date
              </Typography>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="form-control p-2"
                style={{ backgroundColor: "#f6f6f6" }}
              />
              {errors.start_date && (
                <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                  {errors.start_date}
                </Alert>
              )}
            </Box>
            <Box className="w-100">
              <Typography sx={{ color: "#808080" }} className="fw-bold">
                End Date
              </Typography>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="form-control p-2"
                style={{ backgroundColor: "#f6f6f6" }}
              />
              {errors.end_date && (
                <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                  {errors.end_date}
                </Alert>
              )}
            </Box>
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Shift
            </Typography>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className="form-select p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            >
              <option value="" disabled>
                Select Shift
              </option>
              <option value="A">Morning</option>
              <option value="P">Evening</option>
              <option value="N">Night</option>
            </select>
            {errors.shift && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.shift}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Location
            </Typography>
            <App
              nodeData={formData.location}
              lable={formData.location}
              bgcolor={"#f6f6f6"}
              setNodeData={(data) => {
                setAddress(data);

                setFormData((prevFormData) => ({
                  ...prevFormData,
                  location: data?.address || "",
                  latitude: data?.latitude || "",
                  longitude: data?.longitude || "",
                }));
              }}
            />
            {/* <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control p-2"
                style={{ backgroundColor: "#f6f6f6" }}
              /> */}
            {errors.location && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.location}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Salary
            </Typography>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="form-control p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
            {errors.salary && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.salary}
              </Alert>
            )}
          </Box>

          <Box>
            <Typography sx={{ color: "#808080" }} className="fw-bold">
              Department
            </Typography>
            <select
              name="department"
              value={formData.department}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  department: e.target.value,
                }))
              }
              className="form-select p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            >
              <option value="" disabled>
                Select Department
              </option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>

            {errors.department && (
              <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                {errors.department}
              </Alert>
            )}
          </Box>
          <Box className="d-flex align-items-center justify-content-end gap-3">
            <Button
              onClick={() => navigate(-1)}
              className={`px-4 py-2 `}
              sx={{
                textTransform: "none",
                backgroundColor: "inherit",
                border: "1px solid #0a65cc",
                color: "#0a65cc",
                "&:hover": {
                  backgroundColor: "#d0e3f6",
                },
              }}
            >
              Discard
            </Button>
            <Button
              className={`px-4 py-2 `}
              sx={{
                textTransform: "none",
                backgroundColor: "#0a65cc",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0a65cc",
                },
              }}
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerEditJob;
