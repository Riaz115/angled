import {
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import apiClient from "../../api/apiClient";

const EmployeeJobs = () => {
  const [selected, setSelected] = useState(null); // Updated state to track the selected card
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobApplied, setJobApplied] = useState();
  const [jobApproved, setJobApproved] = useState();
  const user = useSelector(selectUser);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelected(null);
  };

  const getJobApplied = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/professional/api/job_application/get_applied_job_applications/`
      );
      console.log(response, "this is job Applied response");
      if (response.ok) {
        setJobApplied(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job data response");
      setLoading(false);
    }
  };

  const getJobApproved = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/professional/api/job_application/get_approved_job_applications/`
      );
      console.log(response, "this is job Applied response");
      if (response.ok) {
        setJobApproved(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job data response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getJobApplied();
      getJobApproved();
    }
  }, [user]);

  const renderJobCards = (jobs) => {
    if (!jobs || jobs.length === 0) {
      return (
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            width: "100%",
            color: "#636a80",
            marginTop: "20px",
          }}
        >
          No jobs available for this tab.
        </Typography>
      );
    }

    return jobs.map((job, index) => (
      <Box
        key={job.id}
        sx={{
          border:
            selected === index ? "2px solid #0a65cc" : "1px solid #f1f2f4",
          cursor: "pointer",
          boxShadow:
            selected === index ? "0px 4px 8px rgba(0, 79, 255, 0.3)" : "none",
        }}
        className="p-4 rounded-3 d-flex align-items-center mb-3 justify-content-between flex-wrap gap-3 col-12"
        onClick={() => setSelected(index)}
      >
        <Box>
          <Typography className="fw-bold">
            {job?.job_details?.title || "N/A"} <br className="d-sm-none" />
            <Typography
              sx={{
                backgroundColor: "#e7f0fa",
                color: "#0a65cc",
                fontSize: "12px",
              }}
              className="rounded-5 px-3 py-2 fw-normal"
              component="span"
            >
              {job?.job_details?.type?.name || "N/A"}
            </Typography>
          </Typography>
          <Box
            className="d-flex flex-column flex-md-row gap-1 align-items-md-center align-items-start mt-2"
            sx={{ fontSize: "12px", color: "#636a80" }}
          >
            <Box className="d-flex align-items-center gap-1">
              <IoLocationOutline size={20} style={{ color: "#c5c9d6" }} />
              <Typography>{job?.job_details?.location || "N/A"}</Typography>
            </Box>
            <Box className="d-flex align-items-center gap-1">
              <BsCurrencyDollar size={20} style={{ color: "#c5c9d6" }} />
              <Typography>${job?.job_details?.salary || "N/A"}</Typography>
            </Box>
            <Box className="d-flex align-items-center gap-1">
              <MdOutlineDateRange size={20} style={{ color: "#c5c9d6" }} />
              <Typography>
                {new Date(job?.job_details?.start_date).toLocaleDateString() ||
                  "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="d-flex align-items-center gap-3">
          {tabValue === 0 ? (
            <Button
              onClick={() => navigate(`/job-details/${job.job}`)}
              className="px-4 py-2"
              sx={{
                textTransform: "none",
                backgroundColor: "#0A65CC",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0A65CC",
                },
              }}
            >
              View details
            </Button>
          ) : (
            <>
              <Button
                className="px-4 py-2"
                sx={{
                  border: "1px solid #0A65CC",
                  textTransform: "none",
                  backgroundColor: "transparent",
                  color: "#0A65CC",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                Message Employer
              </Button>
              <Button
                onClick={() => navigate(`/job-details/${job.job}`)}
                className="px-4 py-2"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#0A65CC",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#0A65CC",
                  },
                }}
              >
                View details
              </Button>
            </>
          )}
        </Box>
      </Box>
    ));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", // Full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box className="px-sm-5" style={{ backgroundColor: "#f1f2f4" }}>
        <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center justify-content-between py-3 ms-4">
          <h5>Jobs/Approved</h5>
        </Box>
      </Box>
      <Box
        className="p-4 bg-white px-5 h-100 ms-4"
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
        {/* Centering the Tabs and removing bottom border */}
        <Box className="d-flex justify-content-center mb-3 mt-1">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="none"
            textColor="primary"
            sx={{
              borderBottom: "none",
              width: { xs: "100%", md: "50%" },
              maxWidth: "1200px",
            }}
          >
            <Tab
              label="Jobs Applied"
              sx={{
                color: tabValue === 0 ? "#0a65cc" : "#333333",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
            <Tab
              label="Approved Jobs"
              sx={{
                color: tabValue === 1 ? "#0a65cc" : "#333333",
                borderLeft: "1px solid black",
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            />
          </Tabs>
        </Box>

        {/* Job listings */}
        <Box className="row">
          {tabValue === 0
            ? renderJobCards(jobApplied)
            : renderJobCards(jobApproved)}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeJobs;
