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
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import FilterModal from "../../../modals/FilterModal";
import { selectUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import apiClient from "../../../api/apiClient";
import { Loader } from "../../../components/Loader/loader";
import { toast } from "react-toastify";

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

const EmployerApplicants = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [selectedView, setSelectedView] = useState("row");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [applicantdata, setApplicantData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("L");
  const [selectedFilters, setSelectedFilters] = useState({
    job_department: "",
    job_role: "",
    job_salary: "",
    job_shift: "",
    job_type: "",
  });

  // Handle the application of filters
  const handleFilterApply = (newFilters) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
    setShowFilterModal(false);
  };

  // Remove a filter from the selectedFilters state
  const removeFilter = (filterKey) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: "" };
      return updatedFilters;
    });
  };

  const getJobApplications = async () => {
    try {
      setLoading(true);

      // Construct query parameters dynamically
      const queryParams = Object.entries(selectedFilters)
        .filter(([key, value]) => value) // Filter out empty values
        .map(([key, value]) => {
          if (key === "job_salary") {
            // Handle the job_salary filter
            const [min, max] = value
              .replace(/\$/g, "") // Remove all dollar signs
              .split(" - ") // Split by the dash
              .map((v) => v.trim().replace(",", "")); // Remove commas and trim spaces
            return `job_salary_min=${min}&job_salary_max=${max}`; // Add salary_min and salary_max
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join("&"); // Join into a query string

      // Construct the full URL with filters
      const url = `/facility/api/job_application/?page_size=${pageSize}&arrange_by=${ordering}${
        queryParams ? `&${queryParams}` : ""
      }`;

      const response = await apiClient.get(url);

      console.log(response, "this is job application response");
      if (response.ok) {
        setApplicantData(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job application response");
      setLoading(false);
    }
  };

  const approveJobApplication = async (applicantId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/job_application/${applicantId}/approve_job_application/`
      );

      if (response.ok) {
        console.log("Job application approved successfully:", response.data);
        toast.success("Job successfully Approved!");
        getJobApplications();
      } else {
        console.error(
          "Failed to approve job application:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error approving job application:", error);
    } finally {
      setLoading(false);
    }
  };

  const declineJobApplication = async (applicantId) => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/job_application/${applicantId}/decline_job_application/`
      );

      if (response.ok) {
        console.log("Job application decline successfully:", response.data);
        toast.success("Job successfully Declined!");

        getJobApplications();
      } else {
        console.error(
          "Failed to decline job application:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error decline job application:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getJobApplications();
    }
  }, [user, pageSize, ordering, selectedFilters]);

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
      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          onApplyFilter={handleFilterApply}
        />
      )}
      <Box className="p-3">
        <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center justify-content-between py-3 me-4 ms-4">
          <Box className="d-flex align-items-center gap-3 flex-wrap">
            <Box
              className="ps-3 py-0 d-flex align-items-center gap-3 rounded-5"
              sx={{ backgroundColor: "#d2d2d2" }}
            >
              <Typography sx={{ fontSize: "13px" }} className="">
                Filter
              </Typography>
              <IconButton onClick={() => setShowFilterModal(true)}>
                <img src="/filterIcon.svg" width={25} />
              </IconButton>
            </Box>

            {/* Dynamically rendering selected filters */}
            {Object.keys(selectedFilters).map((key) => {
              const filterValue = selectedFilters[key];
              if (filterValue) {
                let label = filterValue;
                if (key === "job_shift") {
                  label = shiftMap[filterValue] || filterValue;
                } else if (key === "job_type") {
                  label = typeMap[filterValue] || filterValue;
                }
                return (
                  <Box
                    key={key}
                    className="ps-3 py-0 d-flex align-items-center gap-3 rounded-5"
                    sx={{ backgroundColor: "#d2d2d2" }}
                  >
                    <Typography sx={{ fontSize: "13px" }} className="">
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
        className="bg-white px-sm-5 p-4 h-100 "
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
          {applicantdata?.length > 0 ? (
            applicantdata.map((applicant, index) =>
              selectedView === "row" ? (
                <Box
                  key={applicant.id || index}
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
                  className="p-4 rounded-3 mb-3 col-12"
                >
                  <Box className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <Box className="d-flex gap-2 align-items-center">
                      <Typography className="fw-bold">
                        {applicant?.job_details?.title || "N/A"}
                      </Typography>
                      <Typography
                        sx={{
                          backgroundColor: "#e7f0fa",
                          color: "#0a65cc",
                          fontSize: "12px",
                        }}
                        className="rounded-5 px-3 py-2 fw-normal"
                        component={"span"}
                      >
                        {applicant?.job_details?.type.name ||
                          "Type not specified"}
                      </Typography>
                    </Box>

                    {/* Decline and Accept Buttons */}
                    <Box className="d-flex gap-2">
                      {/* Check the status of the applicant and render buttons accordingly */}
                      {applicant.status === "Pending" && (
                        <>
                          <Button
                            className="px-4 py-2"
                            sx={{
                              textTransform: "none",
                              backgroundColor: "inherit",
                              border: "1px solid #0a65cc",
                              color: "#0a65cc",
                              "&:hover": {
                                backgroundColor: "#d0e3f6",
                              },
                            }}
                            onClick={() => declineJobApplication(applicant.id)}
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={() => approveJobApplication(applicant.id)}
                            className="px-4 py-2"
                            sx={{
                              textTransform: "none",
                              backgroundColor: "#0a65cc",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#0a65cc",
                              },
                            }}
                          >
                            Accept
                          </Button>
                        </>
                      )}
                      {applicant.status === "Approved" && (
                        <Button
                          disabled
                          className="px-4 py-2"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "#0a65cc",
                            color: "white",
                            opacity: 1,
                            pointerEvents: "none",
                            "&.Mui-disabled": {
                              backgroundColor: "#0a65cc",
                              color: "white",
                            },
                          }}
                        >
                          Accepted
                        </Button>
                      )}
                      {applicant.status === "Rejected" && (
                        <Button
                          disabled
                          className="px-4 py-2"
                          sx={{
                            textTransform: "none",
                            backgroundColor: "inherit",
                            border: "1px solid #0a65cc",
                            color: "#0a65cc",
                            opacity: 1,
                            pointerEvents: "none",
                            "&.Mui-disabled": {
                              backgroundColor: "inherit",
                              color: "#0a65cc",
                            },
                          }}
                        >
                          Declined
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Box
                    className="d-flex justify-content-between align-items-start flex-wrap mt-3 gap-3"
                    sx={{ fontSize: "12px", color: "#636a80" }}
                  >
                    {/* Job Details */}
                    <Box
                      className="d-flex flex-column flex-md-row gap-2 align-items-md-center align-items-start"
                      sx={{ flex: 1 }}
                    >
                      {/* Location */}
                      <Box
                        className="d-flex align-items-center gap-1"
                        sx={{ minWidth: "250px", maxWidth: "400px" }}
                      >
                        <IoLocationOutline
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Tooltip
                          title={
                            applicant?.job_details?.location ||
                            "Location not specified"
                          }
                          arrow
                        >
                          <Typography
                            noWrap
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              maxWidth: "250px",
                            }}
                          >
                            {applicant?.job_details?.location ||
                              "Location not specified"}
                          </Typography>
                        </Tooltip>
                      </Box>

                      {/* Salary */}
                      <Box className="d-flex align-items-center gap-1">
                        <BsCurrencyDollar
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>
                          $
                          {applicant?.job_details?.salary ||
                            "Salary not specified"}
                        </Typography>
                      </Box>

                      {/* End Date */}
                      <Box className="d-flex align-items-center gap-1">
                        <MdOutlineDateRange
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>
                          {applicant?.job_details?.end_date ||
                            "Duration not specified"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* View Details */}
                    <Button
                      onClick={() =>
                        navigate(
                          `/employer/applicants/${
                            applicant?.professional || index
                          }`,
                          {
                            state: { jobId: applicant.id },
                          }
                        )
                      }
                      className="px-0 py-2"
                      sx={{
                        width: "fit-content",
                        textTransform: "none",
                        backgroundColor: "inherit",
                        color: "#0a65cc",
                        "&:hover": {
                          backgroundColor: "inherit",
                        },
                      }}
                    >
                      View Details <GoArrowRight size={20} className="ms-1" />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  key={applicant.id || index}
                  className="p-1 col-xl-4 col-md-6 col-12"
                >
                  <Box
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
                      height: "100%", // Ensures consistent height for all cards
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className="p-4 rounded-3"
                  >
                    {/* Title */}
                    <Typography className="mt-3">
                      {applicant?.job_details?.title || "Title not specified"}
                    </Typography>

                    {/* Location (Address in Two Lines with Tooltip) */}
                    <Box
                      className="d-flex align-items-start gap-2"
                      sx={{
                        color: "#9199a3",
                        maxWidth: "100%",
                      }}
                    >
                      <IoLocationOutline
                        size={20} // Maintain consistent icon size
                        style={{ flexShrink: 0 }}
                      />
                      <Tooltip
                        title={
                          applicant?.job_details?.location ||
                          "Location not specified"
                        }
                        arrow
                      >
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2, // Restrict to two lines
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "1.5", // Line spacing for readability
                            wordWrap: "break-word", // Handle long words
                          }}
                        >
                          {applicant?.job_details?.location ||
                            "Location not specified"}
                        </Typography>
                      </Tooltip>
                    </Box>

                    {/* Department Name */}
                    <Typography>
                      {applicant?.job_details?.department_name ||
                        "Department not specified"}
                    </Typography>

                    {/* Additional Details */}
                    <Typography sx={{ color: "#9199a3" }}>
                      {`${
                        applicant?.job_details?.type?.name ||
                        "Type not specified"
                      } . ${
                        applicant?.job_details?.shift?.name ||
                        "Shift not specified"
                      } . $${
                        applicant?.job_details?.salary || "Salary not specified"
                      }`}
                    </Typography>
                  </Box>
                </Box>
              )
            )
          ) : (
            <Typography>No applicants found</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerApplicants;
