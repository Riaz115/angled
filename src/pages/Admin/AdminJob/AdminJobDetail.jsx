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
import apiClient from "../../../api/apiClient";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import { toast } from "react-toastify";

const AdminJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const [isHidden, setIsHidden] = useState(false);

  const getJobData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/job/${id}/job_detail/`);
      if (response.ok) {
        setJobData(response?.data);
        console.log("response data", response.data);
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

  const handleRemoveJob = async (id, event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await apiClient.delete(`/api/job/${id}/`);

      if (response.status === 204) {
        toast.success("Job removed successfully!");
        navigate("/admin/jobs");
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

  const handleHideJob = async (id, event) => {
    event.stopPropagation();
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/job/${id}/hide_job/`);
      if (response.ok) {
        toast.success("Job Hide successfully!");
        setIsHidden(true);
        getJobData();
      } else {
        toast.error("Failed to Hide job. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error Hide job");
      toast.error("An error occurred while Hide the job.");
      setLoading(false);
    }
  };

  const handleUnhideJob = async (id, event) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await apiClient.get(`/api/job/${id}/unhide_job/`);
      if (response.ok) {
        toast.success("Job unHide successfully!");
        setIsHidden(false);
        getJobData();
      } else {
        toast.error("Failed to unHide job. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error unHide job");
      toast.error("An error occurred while unHide the job.");
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
        <Box className="d-flex justify-content-between align-items-center">
          <Typography className="fw-bold fs-4 text-center">
            {jobData?.title || "N/A"}
          </Typography>
          <Box>
            <Box className="d-flex align-items-center gap-3">
              <>
                {jobData?.hide ? (
                  <Button
                    onClick={(event) => {
                      handleUnhideJob(jobData.id, event);
                    }}
                    className={`px-4 py-2`}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#ffcc00",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#ffcc00",
                      },
                    }}
                  >
                    UnHide Job
                  </Button>
                ) : (
                  <Button
                    onClick={(event) => {
                      handleHideJob(jobData.id, event);
                    }}
                    className={`px-4 py-2`}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#0a65cc",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#0a65cc",
                      },
                    }}
                  >
                    Hide Job
                  </Button>
                )}
              </>
              <Button
                onClick={(event) => handleRemoveJob(jobData.id, event)}
                className={`px-4 py-2 `}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#c90101",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#c90101",
                  },
                }}
              >
                Remove Job
              </Button>
            </Box>
            <Typography className="text-end mt-1" sx={{ fontSize: "12px " }}>
              Job expires in{" "}
              <span style={{ color: "#e05151" }}>
                {" "}
                {jobData?.end_date || "N/A"}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box className="row mt-5">
          <Box className="col-xl-7 col-md-6 p-3 order-md-1 order-2">
            <Box className="d-flex flex-column gap-3">
              <Typography className="fw-bold">Job Description</Typography>
              <Typography
                sx={{ color: "#5e6670", fontSize: "14px" }}
                dangerouslySetInnerHTML={{
                  __html: jobData?.description || "<p>N/A</p>",
                }}
              >
                {/* {jobData?.description} */}
              </Typography>
            </Box>
          </Box>
          <Box className="col-xl-5 col-md-6 p-3 order-md-2 order-1">
            <Box className="d-flex flex-column gap-3">
              <Box
                className="rounded-3 p-3 px-4"
                sx={{ border: "1px solid #e7f0fa" }}
              >
                <Typography className="fw-bold">Job Overview</Typography>
                <Box className="mt-3 row">
                  {jobOverViewCards.map((item, index) => (
                    <Box className="col-lg-4 col-6 p-3">
                      <Box className="d-flex flex-column gap-2" key={index}>
                        {item.icon}
                        <Typography
                          className="fw-bold"
                          sx={{ color: "#767f8c", fontSize: "12px" }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "black",
                          }}
                        >
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

export default AdminJobDetail;
