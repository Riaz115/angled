import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { CiStopwatch } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { BsSuitcaseLg } from "react-icons/bs";
import { GoArrowRight } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import ApplyJob from "../../modals/ApplyJob";
import apiClient from "../../api/apiClient";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";

const EmployeeeJobDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const [openModal, setOpenModal] = useState(false);
  const [jobData, setJobData] = useState(null);
  const navigate = useNavigate();

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

  const handleApplyNowClick = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getJobDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/professional/api/job/${id}/`);
      console.log(response, "this is job application response");
      if (response.ok) {
        setJobData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job application response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      getJobDetail();
    }
  }, [id, user]);

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
      <Box
        className="px-sm-5 p-4 col-12"
        style={{ backgroundColor: "#f1f2f4" }}
      >
        <Typography className="fw-bold ms-3">Job Details</Typography>
      </Box>
      <Box
        className="bg-white px-sm-5 p-4 ms-3"
        sx={{
          backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
          url('../../public/signatureBG.svg')`,
          backgroundPosition: "center top",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          overflow: "auto",
        }}
      >
        <Box className="d-flex align-items-center justify-content-between">
          {/* Left-aligned Text */}
          <Typography className="fw-bold fs-4" sx={{ textAlign: "left" }}>
            {jobData?.title || "N/A"}
          </Typography>

          {/* Right-aligned Button with Expiry Text */}
          <Box className="d-flex flex-column align-items-end">
            <Button
              className="px-4 py-2 d-flex align-items-center"
              sx={{
                textTransform: "none",
                backgroundColor: "#0b65cc",
                color: "white",
                "&:hover": {
                  backgroundColor: "#084a9e",
                },
              }}
              onClick={handleApplyNowClick}
            >
              Apply Now <GoArrowRight size={20} className="ms-3" />
            </Button>
            <Typography
              className="mt-2"
              sx={{
                fontSize: "12px",
                color: "#767f8c",
              }}
            >
              Job expire in:{" "}
              <span style={{ color: "#E05151" }}>
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
                  __html: jobData?.description || "N/A",
                }}
              />

              {/* <Typography className="fw-bold">Responsibilities</Typography>
              <Typography
                sx={{ color: "#5e6670", fontSize: "14px" }}
                component={"ul"}
                className="d-flex flex-column gap-3"
              >
                <li>Quisque semper gravida est et consectetur.</li>
                <li>
                  Curabitur blandit lorem velit, vitae pretium leo placerat
                  eget.
                </li>
                <li>Morbi mattis in ipsum ac tempus.</li>
                <li>
                  Curabitur eu vehicula libero. Vestibulum sed purus
                  ullamcorper, lobortis lectus nec.
                </li>
                <li>
                  vulputate turpis. Quisque ante odio, iaculis a porttitor sit
                  amet.
                </li>
                <li>lobortis vel lectus. Nulla at risus ut diam.</li>
                <li>
                  commodo feugiat. Nullam laoreet, diam placerat dapibus
                  tincidunt.
                </li>
                <li>
                  odio metus posuere lorem, id condimentum erat velit nec neque.
                </li>
                <li>dui sodales ut. Curabitur tempus augue.</li>
              </Typography> */}
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
                    <Box className="col-4 p-2">
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
      {openModal && (
        <ApplyJob
          handleClose={handleCloseModal}
          show={openModal}
          jobId={jobData.id}
          jobtitle={jobData.title}
        />
      )}
    </Box>
  );
};

export default EmployeeeJobDetail;
