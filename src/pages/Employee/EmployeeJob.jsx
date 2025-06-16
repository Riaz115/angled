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
import { Link } from "react-router-dom";
import FilterModal from "../../modals/FilterModalEmployeeJob";
import apiClient from "../../api/apiClient";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";

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

const EmployeeJob = () => {
  const [selected, setSelected] = useState("");
  const [selectedView, setSelectedView] = useState("row");
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [jobData, setJobData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [ordering, setOrdering] = useState("id");

  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    salary: "",
    shift: "",
    type: "",
  });

  // Handle the application of filters
  const handleFilterApply = (newFilters) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      return updatedFilters;
    });
    setShowModal(false);
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

  const getJobs = async () => {
    try {
      setLoading(true);

      const queryParams = Object.entries(selectedFilters)
        .filter(([key, value]) => value)
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

      const response = await apiClient.get(
        `/professional/api/job/?page_size=${pageSize}&ordering=${ordering}${
          queryParams ? `&${queryParams}` : ""
        }`
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
      getJobs();
    }
  }, [user, pageSize, ordering, selectedFilters]);

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
    <Box className=" ms-4">
      <Box className="px-sm-5 p-4">
        <Box className="d-flex flex-column flex-xl-row gap-xl-0 gap-3 align-items-center justify-content-between py-3">
          <Box className="d-flex align-items-center gap-3 flex-wrap">
            <Box
              className="ps-3 py-0 d-flex align-items-center gap-3 rounded-5"
              sx={{ backgroundColor: "#d2d2d2" }}
            >
              <Typography sx={{ fontSize: "13px" }} className="">
                Filter
              </Typography>
              <IconButton onClick={() => setShowModal(true)}>
                <img src="/filterIcon.svg" width={25} />
              </IconButton>
            </Box>

            {/* Dynamically rendering selected filters */}
            {Object.keys(selectedFilters).map((key) => {
              const filterValue = selectedFilters[key];
              if (filterValue) {
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
              <option value="id">Latest</option>
              <option value="-id">Older</option>
            </select>

            <select
              className="form-select"
              style={{ width: "150px", fontSize: "15px" }}
              value={pageSize} // Bind to the state
              onChange={handlePageSizeChange}
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
          {jobData?.length > 0 ? (
            jobData?.map((job, index) =>
              selectedView === "row" ? (
                <Box
                  key={job.id}
                  className="p-4 rounded-3 d-flex align-items-center mb-3 justify-content-between flex-wrap gap-3 col-12"
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
                >
                  <Box>
                    <Typography className="fw-bold">
                      {job.title || "N/A"} <br className="d-sm-none " />
                      <Typography
                        sx={{
                          backgroundColor: "#e7f0fa",
                          color: "#0a65cc",
                          fontSize: "12px",
                        }}
                        className="rounded-5 px-3 py-2 fw-normal"
                        component="span"
                      >
                        {job.type?.name || "N/A"}
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
                          title={job?.location || "Location not specified"}
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
                            {job?.location || "Location not specified"}
                          </Typography>
                        </Tooltip>
                      </Box>
                      <Box className="d-flex align-items-center gap-1">
                        <BsCurrencyDollar
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>${job.salary || "N/A"}</Typography>
                      </Box>
                      <Box className="d-flex align-items-center gap-1">
                        <MdOutlineDateRange
                          size={20}
                          style={{ color: "#c5c9d6" }}
                        />
                        <Typography>
                          {job.start_date
                            ? `${job.start_date} - ${job.end_date || "N/A"}`
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box className="d-flex flex-column gap-2 align-items-end">
                    <Box className="d-flex align-items-center gap-3">
                      <Link to={`/find-employee/job/detail/${job.id}`}>
                        <Button
                          className="px-4 py-2"
                          sx={{
                            textTransform: "none",
                            backgroundColor:
                              index === selected ? "#0a65cc" : "#e7f0fa",
                            fontSize: "16px",
                            fontWeight: 400,
                            color: index === selected ? "white" : "#0a65cc",
                            "&:hover": {
                              backgroundColor: "#0a65cc",
                              color: "white",
                            },
                          }}
                        >
                          Apply Now <GoArrowRight size={20} className="ms-2" />
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box key={job.id} className="p-1 col-xl-4 col-md-6 col-12">
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
                    }}
                    className="p-4 rounded-3 d-flex flex-column"
                  >
                    <Typography>{job.department_name || "N/A"}</Typography>

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
                        title={job?.location || "Location not specified"}
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
                          {job?.location || "Location not specified"}
                        </Typography>
                      </Tooltip>
                    </Box>

                    <Typography
                      className="mt-3"
                      style={{
                        color: index === selected ? "#0A65CC" : "inherit",
                      }}
                    >
                      {job.title || "N/A"}
                    </Typography>
                    <Typography style={{ color: "#9199a3" }}>
                      {`${job.type?.name || "N/A"} · ${
                        job.shift?.name || "N/A"
                      } · $${job.salary || "N/A"}`}
                    </Typography>
                  </Box>
                </Box>
              )
            )
          ) : (
            <Typography
              sx={{
                display: "flex",
                textAlign: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              No Job Found
            </Typography>
          )}
        </Box>
      </Box>
      <FilterModal
        show={showModal}
        onHide={handleCloseModal}
        onApplyFilter={handleFilterApply}
      />
    </Box>
  );
};

export default EmployeeJob;
