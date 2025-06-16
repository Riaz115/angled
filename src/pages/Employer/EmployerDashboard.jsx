import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GrSearchAdvanced } from "react-icons/gr";
import { BsCurrencyDollar } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import FilterModal from "../../modals/FilterModalEmployer";
import apiClient from "../../api/apiClient";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [selectedView, setSelectedView] = useState("row");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartment] = useState();
  const user = useSelector(selectUser);
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("L");
  const [applicantdata, setApplicantData] = useState();
  const [selectedFilters, setSelectedFilters] = useState({
    job_department: "",
    job_role: "",
    job_salary: "",
    job_shift: "",
    job_type: "",
    search: "",
    location: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleLocationChange = (event) => {
    setLocationInput(event.target.value); // Update the location input state
  };

  // Handle input change for search
  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCardClick = (professionId) => {
    navigate(`/employer/professional/${professionId}`);
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
      location: locationInput,
    }));
  };

  // Remove a filter from the selectedFilters state
  const removeFilter = (filterKey) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterKey]: "" };
      return updatedFilters;
    });
  };

  const handleDepartmentChange = (event) => {
    setSelectedFilters((prev) => ({
      ...prev,
      job_department: event.target.value, // Set the selected department
    }));
  };

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

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleOrderingChange = (e) => {
    setOrdering(e.target.value);
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
        .join("&");

      const url = `/facility/api/job_application/get_approved_application/?page_size=${pageSize}&arrange_by=${ordering}${
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

  useEffect(() => {
    if (user) {
      getJobApplications();
    }
  }, [user, pageSize, ordering, selectedFilters]);

  useEffect(() => {
    if (user) {
      getdepartment();
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

  return (
    <Box className="d-flex flex-column align-items-center w-100">
      {showFilterModal && (
        <FilterModal
          show={showFilterModal}
          onHide={() => setShowFilterModal(false)}
          onApplyFilter={handleFilterApply}
        />
      )}
      <Box className="py-5 me-4 ms-4" sx={{ width: "92%" }}>
        <Typography className="fw-bold mb-1">
          Find Healthcare Professionals
        </Typography>
        <Box className="border p-3 bg-white rounded-3 d-flex flex-column flex-xxl-row flex-lg-row  gap-xxl-0 gap-3 align-items-center justify-content-between">
          <Box className="d-flex flex-row gap-2 align-items-center w-100 filterRightBorder">
            <CiSearch style={{ color: "#0a65cc" }} size={25} />
            <input
              className="w-100"
              type="text"
              style={{ border: "none", outline: "none" }}
              placeholder="Job title, Keyword..."
              value={searchInput}
              onChange={handleSearchChange}
            />
          </Box>
          <Box className="d-flex flex-row gap-2 align-items-center w-100 ps-xxl-3 ps-0 filterRightBorder">
            <IoLocationOutline style={{ color: "#0a65cc" }} size={25} />
            <input
              className="w-100"
              type="text"
              style={{ border: "none", outline: "none" }}
              placeholder="Location"
              value={locationInput} // Controlled input for location
              onChange={handleLocationChange} // Update location input
            />
          </Box>
          <Box className="d-flex flex-row gap-2 align-items-center w-100 ps-xxl-3 ps-0 filterRightBorder">
            <img src="/selectDepartment.svg" width={25} />
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <Select
                disableUnderline
                className="w-100"
                displayEmpty
                IconComponent={ExpandMoreIcon}
                value={selectedFilters.job_department}
                onChange={handleDepartmentChange} // Handle selection
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#aaa" }}>Select Dept.</span>;
                  }
                  // Find the department by id and display its name
                  const selectedDept = departments.find(
                    (dept) => dept.name === selected
                  );
                  return selectedDept ? selectedDept.name : "Select Dept.";
                }}
              >
                <MenuItem value="">
                  <Typography style={{ color: "#aaa" }}>None</Typography>
                </MenuItem>
                {departments?.map((department) => (
                  <MenuItem key={department.id} value={department.name}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box
            className="d-flex flex-row gap-2 align-items-center w-100 ps-xxl-3 ps-0"
            sx={{ cursor: "pointer" }}
            onClick={() => setShowFilterModal(true)}
          >
            <GrSearchAdvanced style={{ color: "#0a65cc" }} size={25} />
            <Typography sx={{ color: "#aaa" }}>Advanced Filter</Typography>
          </Box>
          <Button
            onClick={handleSearch}
            sx={{
              textTransform: "none",
              backgroundColor: "#0a65cc",
              "&:hover": {
                backgroundColor: "#084a9e",
              },
            }}
            className="py-3 px-5 text-white "
          >
            Find
          </Button>
        </Box>
      </Box>
      <Box
        className="bg-white d-flex justify-content-center pb-3"
        sx={{
          backgroundImage: `
    linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
    url('../../public/signatureBG.svg')
  `,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Box
          className="d-flex flex-column gap-3 "
          sx={{
            width: "92%",
          }}
        >
          <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center justify-content-between py-3">
            {/* Filter section */}
            <Box
              className="d-flex align-items-center gap-3 flex-wrap"
              sx={{
                maxWidth: "100%", // Ensures it doesn't overflow the container
                overflow: "hidden", // Optional, hide overflow if necessary
              }}
            >
              {Object.keys(selectedFilters).map((key) => {
                const filterValue = selectedFilters[key];
                if (filterValue && key !== "search" && key !== "location") {
                  // Exclude 'search' and 'location'
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

            {/* Sort and View Section */}
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
                className="d-flex align-items-center rounded-3"
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

          <Box className="row me-1 ms-1">
            {applicantdata?.length > 0 ? (
              applicantdata.map((applicant, index) => {
                const jobDetails = applicant.job_details || {}; // Safely access job_details
                return selectedView === "row" ? (
                  <Box
                    key={applicant.id || index}
                    onClick={() =>
                      handleCardClick(applicant.professional || "")
                    }
                    sx={{
                      cursor: "pointer",
                      border:
                        index === selected
                          ? "2px solid #0a65cc"
                          : "1px solid #e4e5e8",
                      boxShadow:
                        index === selected
                          ? "0px 4px 8px rgba(0, 79, 255, 0.3)"
                          : "none",
                    }}
                    className="p-4 rounded-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-3 col-12"
                  >
                    <Box>
                      <Typography className="fw-bold">
                        {jobDetails.title || "No Title"}{" "}
                        {/* Display job title */}
                        <Typography
                          sx={{
                            backgroundColor: "#e7f0fa",
                            color: "#0a65cc",
                            fontSize: "12px",
                          }}
                          className={`rounded-5 px-3 py-2 ${
                            selected === index ? "fw-bold" : "fw-normal"
                          }`}
                          component={"span"}
                        >
                          {jobDetails.type?.name || "Unknown Type"}{" "}
                        </Typography>
                      </Typography>
                      <Box
                        className="d-flex flex-column flex-md-row gap-1 align-items-md-center align-items-start mt-2"
                        sx={{ fontSize: "12px", color: "#636a80" }}
                      >
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
                              jobDetails?.location || "Location not specified"
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
                              {jobDetails?.location || "Location not specified"}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <Box className="d-flex align-items-center gap-1">
                          <BsCurrencyDollar
                            size={20}
                            style={{ color: "#c5c9d6" }}
                          />
                          <Typography>
                            {jobDetails.salary || "Salary not available"}
                          </Typography>
                        </Box>
                        <Box className="d-flex align-items-center gap-1">
                          <MdOutlineDateRange
                            size={20}
                            style={{ color: "#c5c9d6" }}
                          />
                          <Typography>
                            {jobDetails.start_date ||
                              "Start date not available"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Button
                      className={`${
                        selected === index ? "px-4" : "px-3"
                      } py-2 fw-bold`}
                      sx={{
                        textTransform: "none",
                        backgroundColor:
                          selected === index ? "#0a65cc" : "#e7f0fa",
                        color: selected === index ? "white" : "#0a65cc",
                        "&:hover": {
                          backgroundColor:
                            selected === index ? "#0a65cc" : "#d0e3f6",
                        },
                      }}
                    >
                      Message Now
                    </Button>
                  </Box>
                ) : (
                  <Box
                    key={applicant.id || index}
                    onClick={() =>
                      handleCardClick(applicant.professional || "")
                    }
                    className="p-1 col-xl-4 col-md-6 col-12 cursor-pointer"
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
                      {/* Department Name */}
                      <Typography>
                        {applicant?.job_details?.department_name ||
                          "Department not specified"}
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

                      {/* Title */}
                      <Typography className="mt-3">
                        {applicant?.job_details?.title || "Title not specified"}
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
                          applicant?.job_details?.salary ||
                          "Salary not specified"
                        }`}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography>No applicants available.</Typography> // Fallback message when data is empty or undefined
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerDashboard;
