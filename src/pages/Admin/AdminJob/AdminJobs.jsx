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
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import ImportJobsModal from "../../../modals/ImportJobsModal";
import apiClient from "../../../api/apiClient";
import { selectUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterModalAdmin from "../../../modals/FilterModalAdmin";

const shiftMap = {
  A: "Morning",
  P: "Evening",
  N: "Night",
};

const typeMap = {
  C: "Contract",
  DH: "Direct Hire",
  D: "Diem",
};

const AdminJobs = () => {
  const [selected, setSelected] = useState("");
  const [selectedView, setSelectedView] = useState("row");
  const [showImportModal, setShowImportModal] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("L");
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    department: "",
    role: "",
    salary: "",
    shift: "",
    type: "",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  // Handle input change for search
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Trigger the search when Enter is pressed
    }
  };

  const handleFilterApply = (newFilters) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
    setShowFilterModal(false);
  };

  const handleSearch = () => {
    setSelectedFilters((prev) => ({
      ...prev,
      search: searchInput,
    }));
  };

  // Remove a filter from the selectedFilters state
  const removeFilter = (filterKey) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: "" };
      return updatedFilters;
    });
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
  };

  const getJobData = async () => {
    try {
      setLoading(true);

      // Construct query parameters dynamically
      const queryParams = Object.entries(selectedFilters)
        .filter(([key, value]) => value) // Filter out empty values
        .map(([key, value]) => {
          if (key === "salary") {
            // Handle the job_salary filter
            const [min, max] = value
              .replace(/\$/g, "") // Remove all dollar signs
              .split(" - ") // Split by the dash
              .map((v) => v.trim().replace(",", "")); // Remove commas and trim spaces
            return `salary_min=${min}&salary_max=${max}`; // Add salary_min and salary_max
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join("&");

      const url = `/api/job/?page_size=${pageSize}&arrange_by=${ordering}${
        queryParams ? `&${queryParams}` : ""
      }`;

      const response = await apiClient.get(url);

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

  const handleRemoveJob = async (id, event) => {
    // Prevent the default action (if the event is from a form submission)
    event.preventDefault();

    try {
      setLoading(true);
      const response = await apiClient.delete(`/api/job/${id}/`);

      if (response.status === 204) {
        toast.success("Job removed successfully!");
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

  useEffect(() => {
    if (user) {
      getJobData();
    }
  }, [user, pageSize, ordering, selectedFilters]);

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
    <Box sx={{ height: "100%", backgroundColor: "#fff" }}>
      {showFilterModal && (
        <FilterModalAdmin
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          onApplyFilter={handleFilterApply}
        />
      )}
      {showImportModal && (
        <ImportJobsModal
          show={showImportModal}
          onHide={() => setShowImportModal(false)}
        />
      )}
      <Box className="px-sm-5 p-2 bg-white h-full">
        <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center justify-content-between  ">
          <Box
            className="ps-3 py-0 d-flex align-items-center gap-3 rounded-5 "
            sx={{ backgroundColor: "#f1f2f4" }}
          >
            <Typography sx={{ fontSize: "13px" }} className="">
              Filter
            </Typography>
            <IconButton onClick={() => setShowFilterModal(true)}>
              <img src="/filterIcon.svg" width={25} />
            </IconButton>
          </Box>
          <Box
            className="position-relative rounded-3 "
            sx={{
              width: {
                xs: "70%",
                sm: "50%",
                md: "40%",
              },
            }}
          >
            <input
              type="text"
              className="form-control ps-5"
              style={{ border: "1px solid #808080" }}
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <CiSearch
              className="position-absolute"
              size={25}
              style={{ bottom: "7px", left: "4px" }}
            />
          </Box>
          <Box className="d-flex flex-column flex-sm-row align-items-center gap-3">
            {/* <select
              className="form-select w-100"
              style={{ width: "150px", fontSize: "15px" }}
              value={ordering} // Bind to the state
              onChange={handleOrderingChange}
            >
              <option value="L">Latest</option>
              <option value="O">Older</option>
            </select> */}

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
        className="d-flex align-items-center gap-3 flex-wrap px-sm-5 p-2 "
        sx={{
          maxWidth: "100%", // Ensures it doesn't overflow the container
          overflow: "hidden", // Optional, hide overflow if necessary
        }}
      >
        {Object.keys(selectedFilters).map((key) => {
          const filterValue = selectedFilters[key];
          if (filterValue && key !== "search") {
            // Exclude 'search' and 'location'
            let label = filterValue;
            if (key === "shift") {
              label = shiftMap[filterValue] || filterValue;
            } else if (key === "type") {
              label = typeMap[filterValue] || filterValue;
            }
            return (
              <Box
                key={key}
                className="ps-3 py-0 d-flex align-items-center gap-3 rounded-5"
                sx={{
                  backgroundColor: "#F1F2F4",
                  flexShrink: 0,
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                  }}
                >
                  {label}
                </Typography>
                <IconButton onClick={() => removeFilter(key)}>
                  <img src="/cancel.svg" width={25} />
                </IconButton>
              </Box>
            );
          }
          return null;
        })}
      </Box>
      <Box
        className="p-3 bg-white px-5 h-full "
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
        <Box className="row me-1 ms-1">
          {jobData?.length > 0 ? (
            jobData.map((job, index) =>
              selectedView === "row" ? (
                <Box
                  onClick={() => navigate(`/admin/jobs/${job?.id ?? index}`)}
                  key={job?.id ?? index}
                  sx={{
                    cursor: "pointer",
                    border: "1px solid #e4e5e8",
                    boxShadow: "none",
                    "&:hover": {
                      border: "2px solid #0a65cc",
                      boxShadow: "0px 4px 8px rgba(0, 79, 255, 0.3)",
                    },
                  }}
                  className="p-4 rounded-3 d-flex align-items-center mb-3 justify-content-between flex-wrap gap-3 col-12"
                >
                  <Box>
                    <Typography
                      className="fw-bold"
                      sx={{
                        color: "black",
                      }}
                    >
                      {job?.title || "Job Title Not Available"}{" "}
                      <br className="d-sm-none" />
                      <Typography
                        sx={{
                          backgroundColor: "#e7f0fa",
                          color: "#0a65cc",
                          fontSize: "12px",
                        }}
                        className={`rounded-5 px-3 py-2 fw-normal`}
                        component={"span"}
                      >
                        {job?.type?.name || "Type Not Available"}
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
                      <Box className="d-flex align-items-center gap-1">
                        <BsCurrencyDollar
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>
                          {job?.salary
                            ? `$${parseFloat(job.salary).toLocaleString()}`
                            : "Salary Not Available"}
                        </Typography>
                      </Box>
                      <Box className="d-flex align-items-center gap-1">
                        <MdOutlineDateRange
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>
                          {job?.start_date && job?.end_date
                            ? `${new Date(
                                job.start_date
                              ).toLocaleDateString()} - ${new Date(
                                job.end_date
                              ).toLocaleDateString()}`
                            : "Dates Not Available"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="d-flex align-items-center gap-3">
                    <>
                      {job?.hide ? (
                        <Button
                          onClick={(event) => {
                            handleUnhideJob(job.id, event);
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
                            handleHideJob(job.id, event);
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
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent navigation
                        handleRemoveJob(job.id, event);
                      }}
                      className={`px-4 py-2`}
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
                </Box>
              ) : (
                <Box
                  key={job?.id ?? index}
                  className="p-1 col-xl-4 col-md-6 col-12"
                >
                  <Box
                    onClick={() => navigate(`/admin/jobs/${job?.id ?? index}`)}
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
                            display: "block",
                            maxWidth: "200px",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitBoxOrient: "vertical",
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // Limits text to two lines
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
            <Typography>No Jobs Available</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminJobs;
