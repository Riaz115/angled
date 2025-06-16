import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { CiStopwatch } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { BsSuitcaseLg } from "react-icons/bs";

import { IoShareSocial } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const EmployerJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);

  const getJobData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/job/${id}/job_detail/`
      );
      if (response.ok) {
        setJobData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job data response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getJobData();
    }
  }, [user]);

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

  const jobOverViewCards = [
    {
      id: 1,
      name: "START DATE",
      detail: jobData?.start_date || "N/A",
      icon: <MdOutlineDateRange size={30} className="text_blue" />,
    },
    {
      id: 2,
      name: "Shift",
      detail: jobData?.shift.name || "N/A",
      icon: <CiStopwatch size={30} className="text_blue" />,
    },
    {
      id: 3,
      name: "SALARY",
      detail: `$${jobData?.salary || "N/A"}/month`,
      icon: <IoWalletOutline size={30} className="text_blue" />,
    },
    {
      id: 4,
      name: "LOCATION",
      detail: jobData?.location || "N/A",
      icon: <IoLocationOutline size={30} className="text_blue" />,
    },
    {
      id: 5,
      name: "Job Type",
      detail: jobData?.type.name || "N/A",
      icon: <BsSuitcaseLg size={30} className="text_blue" />,
    },
    {
      id: 6,
      name: "Department",
      detail: jobData?.department_name || "N/A",
      icon: <BsSuitcaseLg size={30} className="text_blue" />,
    },
  ];

  const handleRemoveJob = async (id) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/facility/api/job/${id}/`);

      if (response.status === 204) {
        toast.success("Job removed successfully!");
        navigate("/employer/jobs");
        getJobData();
      } else {
        toast.error("Failed to remove job. Please try again."); // Show error toast
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error removing job");
      toast.error("An error occurred while removing the job."); // Show error toast
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box className="px-sm-5 p-4">
        <Typography className="fw-bold ">Job Details</Typography>
      </Box>
      <Box
        className="bg-white px-sm-5 p-4"
        sx={{
          backgroundImage: `
linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
url('../../public/signatureBG.svg')
`,
          backgroundPosition: "center top",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          overflow: "auto",
        }}
      >
        <Typography className="fw-bold fs-4 text-center">
          {jobData?.title || "N/A"}
        </Typography>
        <Box className="row mt-5">
          <Box className="col-xl-7 col-md-6 p-3 order-md-1 order-2">
            <Box className="d-flex flex-column gap-3">
              <Typography className="fw-bold">Job Description</Typography>
              <Typography
                sx={{ color: "#5e6670", fontSize: "14px" }}
                dangerouslySetInnerHTML={{
                  __html: jobData?.description || "<p>N/A</p>",
                }}
              ></Typography>
            </Box>
          </Box>
          <Box className="col-xl-5 col-md-6 p-3 order-md-2 order-1">
            <Box className="d-flex flex-column gap-3">
              <Box className="d-flex align-items-center gap-3">
                <Button
                  className="px-4 py-2 w-100"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#c90101",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#c90101",
                    },
                  }}
                  onClick={() => handleRemoveJob(jobData.id)}
                >
                  Remove Job
                </Button>
                <Box
                  onClick={() =>
                    navigate("/employer/jobs/editjob", {
                      state: { id: jobData.id },
                    })
                  }
                  className="p-2 rounded-3 d-flex justify-content-center align-items-center"
                  sx={{ backgroundColor: "#e4e5e8", cursor: "pointer" }}
                >
                  <FaRegEdit size={25} style={{ color: "#767f8c" }} />
                </Box>

                <Box
                  className="p-2 rounded-3 d-flex justify-content-center align-items-center"
                  sx={{ backgroundColor: "#e4e5e8", cursor: "pointer" }}
                >
                  <IoShareSocial size={25} style={{ color: "#767f8c" }} />
                </Box>
              </Box>

              <Box
                className="rounded-3 p-3 px-4"
                sx={{ border: "1px solid #e7f0fa" }}
              >
                <Typography className="fw-bold">Job Overview</Typography>
                <Box className="mt-3 row">
                  {jobOverViewCards.map((item, index) => (
                    <Box className="col-6 p-2">
                      <Box className="d-flex flex-column gap-2" key={index}>
                        {item.icon}
                        <Typography
                          className="fw-bold"
                          sx={{ color: "#767f8c", fontSize: "12px" }}
                        >
                          {item.name}
                        </Typography>
                        <Typography className="fw-bold">
                          {item.detail}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              className="d-flex flex-column gap-3 mt-3 p-4"
              sx={{ border: "1px solid #e7f0fa", borderRadius: "12px" }}
            >
              <Typography className="fw-bold">
                {jobData?.facility_details?.user?.name}
              </Typography>

              {[
                {
                  label: "Founded in",
                  value: jobData?.facility_details?.founded_date || "N/A",
                },
                {
                  label: "Hospital Type",
                  value: jobData?.facility_details?.type || "N/A",
                },
                {
                  label: "Speciality",
                  value: jobData?.facility_details?.speciality || "N/A",
                },
                {
                  label: "Employer Phone",
                  value: jobData?.facility_details?.user?.phone || "N/A",
                },
                {
                  label: "Employer Email",
                  value: jobData?.facility_details?.user?.email || "N/A",
                },
                {
                  label: "Website",
                  value: jobData?.facility_details?.website || "N/A",
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  className="d-flex align-items-start justify-content-between"
                  sx={{ flexWrap: "wrap" }}
                >
                  <Typography
                    sx={{
                      color: "#5e6670",
                      fontSize: "14px",
                      minWidth: "120px",
                    }}
                  >
                    {item.label} :
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      wordBreak: "break-word",
                      textAlign: "right",
                      flex: 1,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerJobDetail;
