import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { MdOutlineDateRange } from "react-icons/md";
import { CiStopwatch } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { BsSuitcaseLg } from "react-icons/bs";
import { IoShareSocial } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import ApplyJob from "../../modals/ApplyJob";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import apiClient from "../../api/apiClient";

const JobDetails = () => {
  const { id } = useParams();
  const [loadingJobDetail, setLoadingJobDetail] = useState(false);
  const [loadingJobInstruction, setLoadingJobInstruction] = useState(false);
  const user = useSelector(selectUser);
  const [openModal, setOpenModal] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [jobInstruction, setJobInstruction] = useState(null);
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
    setLoadingJobDetail(true);
    try {
      const response = await apiClient.get(
        `/professional/api/job/${id}/job_detail/`
      );
      if (response.ok) {
        setJobData(response?.data);
      }
    } catch (error) {
      console.error(error, "Error fetching job detail");
    } finally {
      setLoadingJobDetail(false);
    }
  };

  const getJobInstruction = async () => {
    setLoadingJobInstruction(true);
    try {
      const response = await apiClient.get(
        `/professional/api/instruction/${id}/get_job_instruction/`
      );

      if (response.ok) {
        setJobInstruction(response?.data);
      }
    } catch (error) {
      console.error(error, "Error fetching job instruction");
    } finally {
      setLoadingJobInstruction(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      getJobDetail();
      getJobInstruction();
    }
  }, [id, user]);

  if (loadingJobDetail || loadingJobInstruction) {
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
        <Typography className="fw-bold ">Job Details</Typography>
      </Box>
      <Box
        className="bg-white px-sm-5 p-4"
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
                  __html: jobData?.description || "N/A",
                }}
              />
            </Box>
          </Box>
          <Box className="col-xl-5 col-md-6 p-3 order-md-2 order-1">
            <Box className="d-flex flex-column gap-3">
              <Box className="d-flex align-items-center justify-content-end gap-3">
                <Button
                  className="px-4 py-2"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#0b65cc",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#084a9e", // Slightly darker hover effect
                    },
                  }}
                  onClick={handleApplyNowClick}
                >
                  Message Employer
                </Button>
              </Box>

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
        {jobInstruction?.instruction && (
          <Card
            className="p-4 my-4"
            style={{ borderRadius: "10px", border: "1px solid #e0e0e0" }}
          >
            <h5>Instructions From Employer</h5>
            {loadingJobInstruction ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px", // Adjust height as needed
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <p
                  className="text-muted mb-4"
                  style={{ fontSize: "0.875rem " }}
                >
                  Last Updated:{" "}
                  {jobInstruction?.updated_at
                    ? new Date(jobInstruction.updated_at).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        }
                      )
                    : "N/A"}
                </p>
                <div
                  style={{ color: "#5E6670" }}
                  dangerouslySetInnerHTML={{
                    __html: jobInstruction.instruction,
                  }}
                ></div>
              </>
            )}
          </Card>
        )}
      </Box>
      {openModal && (
        <ApplyJob handleClose={handleCloseModal} show={openModal} />
      )}
    </Box>
  );
};

export default JobDetails;
