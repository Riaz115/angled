import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImportJobsModal from "../../../modals/ImportJobsModal";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";
import { Loader } from "../../../components/Loader/loader";
import apiClient from "../../../api/apiClient";
import { toast } from "react-toastify";

const EmployerJobs = () => {
  const [selected, setSelected] = useState("");
  const [selectedView, setSelectedView] = useState("row");
  const [showImportModal, setShowImportModal] = useState(false);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("L");
  const navigate = useNavigate();

  const getJobData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/job/?page_size=${pageSize}&arrange_by=${ordering}`
      );
      console.log(response, "this is job data response");
      if (response.ok) {
        setJobData(response?.data?.results);
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
  }, [user, pageSize, ordering]);

  const handleRemoveJob = async (id) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/facility/api/job/${id}/`);

      if (response.status === 204) {
        toast.success("Job removed successfully!"); // Show success toast
        // Optionally, refresh the job data or navigate away
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

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
  };

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
      {showImportModal && (
        <ImportJobsModal
          show={showImportModal}
          onHide={() => setShowImportModal(false)}
        />
      )}
      <Box className="p-3">
        <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center me-4 ms-4 justify-content-between py-3">
          <Box className="d-flex align-items-center gap-3">
            <Button
              onClick={() => navigate("/employer/jobs/postjob")}
              className={`px-4 py-2 `}
              sx={{
                textTransform: "none",
                backgroundColor: "#0a65cc",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0a65cc",
                },
              }}
            >
              Post a Job
            </Button>
            <Button
              onClick={() => setShowImportModal(true)}
              className={`px-4 py-2 `}
              sx={{
                textTransform: "none",
                backgroundColor: "#0a65cc",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0a65cc",
                },
              }}
            >
              Import Jobs
            </Button>
          </Box>
          <Box className="d-flex flex-column flex-sm-row align-items-center gap-3">
            <select
              className="form-select w-100"
              style={{ width: "150px", fontSize: "15px" }}
              value={ordering} // Bind to the state
              onChange={handleOrderingChange}
            >
              <option value="L">Latest</option>
              <option value="O">Older</option>
            </select>

            <select
              className="form-select"
              style={{ width: "150px", fontSize: "15px" }}
              value={pageSize} // Bind to the state
              onChange={handlePageSizeChange} // Handle page size change
            >
              <option value={10}>10 Per Page</option>
              <option value={20}>20 Per Page</option>
              <option value={30}>30 Per Page</option>
              <option value={40}>40 Per Page</option>
              <option value={50}>50 Per Page</option>
            </select>

            <Box
              className="d-flex align-items-center rounded-3 bg-white"
              sx={{ border: "1px solid #e4e5e8" }}
            >
              <IconButton
                sx={{
                  backgroundColor:
                    selectedView === "grid" ? "#e7f0fa" : "inherit",
                }}
                onClick={() => setSelectedView("grid")}
              >
                <img src="/fourSquare.svg" width={20} />
              </IconButton>
              <IconButton
                onClick={() => setSelectedView("row")}
                sx={{
                  backgroundColor:
                    selectedView === "row" ? "#e7f0fa" : "inherit",
                }}
              >
                <img src="/twoRectangle.svg" width={20} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className="p-3 bg-white px-5 h-100 "
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
        <Box className="row">
          {jobData && jobData.length > 0 ? (
            jobData.map((job, index) =>
              selectedView === "row" ? (
                <Box
                  key={index}
                  onClick={() => setSelected(index)}
                  sx={{
                    border:
                      index === selected
                        ? "2px solid #0a65cc"
                        : "1px solid #e4e5e8",
                    boxShadow:
                      index === selected
                        ? "0px 4px 8px rgba(0, 79, 255, 0.3)"
                        : "none",
                  }}
                  className="p-4 rounded-3 d-flex align-items-center mb-3 justify-content-between flex-wrap gap-3 col-12"
                >
                  <Box>
                    <Typography className="fw-bold">
                      {job.title || "Job Title"} <br className="d-sm-none " />
                      <Typography
                        sx={{
                          backgroundColor: "#e7f0fa",
                          color: "#0a65cc",
                          fontSize: "12px",
                        }}
                        className="rounded-5 px-3 py-2 fw-normal"
                        component={"span"}
                      >
                        {job.type.name || "Job Type"}
                      </Typography>
                    </Typography>
                    <Box
                      className="d-flex flex-column flex-md-row gap-1 align-items-md-center align-items-start mt-2"
                      sx={{ fontSize: "12px", color: "#636a80" }}
                    >
                      {job.location && (
                        <Box className="d-flex align-items-center gap-1">
                          <IoLocationOutline
                            size={20}
                            style={{ color: "#c5c9d6" }}
                          />
                          <Tooltip title={job.location} arrow>
                            <Typography
                              sx={{
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {job.location.split(" ").slice(0, 4).join(" ")}
                              {job.location.split(" ").length > 4 ? "..." : ""}
                            </Typography>
                          </Tooltip>
                        </Box>
                      )}
                      {job.salary && (
                        <Box className="d-flex align-items-center gap-1">
                          <BsCurrencyDollar
                            size={20}
                            style={{ color: "#c5c9d6" }}
                          />
                          <Typography>${job.salary}</Typography>
                        </Box>
                      )}
                      {job.start_date && (
                        <Box className="d-flex align-items-center gap-1">
                          <MdOutlineDateRange
                            size={20}
                            style={{ color: "#c5c9d6" }}
                          />
                          <Typography>
                            {new Date(job.start_date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box className="d-flex align-items-center gap-3">
                    <Button
                      className="px-4 py-2"
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#c90101",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#c90101",
                        },
                      }}
                      onClick={() => handleRemoveJob(job.id)}
                    >
                      Remove Job
                    </Button>

                    <Box
                      onClick={() => navigate(`/employer/jobs/${job.id}`)}
                      className="p-2 rounded-3 d-flex justify-content-center align-items-center"
                      sx={{ backgroundColor: "#e4e5e8", cursor: "pointer" }}
                    >
                      <FaRegEdit size={25} style={{ color: "#767f8c" }} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box key={index} className="p-1 col-xl-4 col-md-6 col-12">
                  <Box
                    onClick={() => setSelected(index)}
                    sx={{
                      display: "flex", // Use flex to ensure equal height
                      flexDirection: "column", // Align items vertically
                      justifyContent: "space-between", // Distribute space evenly
                      border:
                        index === selected
                          ? "2px solid #0a65cc"
                          : "1px solid #e4e5e8",
                      boxShadow:
                        index === selected
                          ? "0px 4px 8px rgba(0, 79, 255, 0.3)"
                          : "none",
                      height: "100%", // Ensure full height for flexbox alignment
                    }}
                    className="p-4 rounded-3 d-flex flex-column"
                  >
                    <Typography>{job.title || "Job Title"}</Typography>
                    <Box className="d-flex gap-1" style={{ color: "#9199a3" }}>
                      {job.location && <IoLocationOutline size={20} />}
                      <Tooltip title={job.location} arrow>
                        <Typography
                          sx={{
                            maxWidth: "200px",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            display: "-webkit-box"
                          }}
                        >
                          {job.location}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Typography className="mt-3">
                      {job.department_name || "Department Name"}
                    </Typography>
                    <Typography style={{ color: "#9199a3" }}>
                      {job.type.name || "Job Type"} .{" "}
                      {job.shift.name || "Shift"} . $
                      {job.salary || "Salary not available"}
                    </Typography>
                  </Box>
                </Box>
              )
            )
          ) : (
            <Box className="d-flex justify-content-center align-items-center w-100 h-100">
              <Typography className="text-center">No Jobs Available</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerJobs;
