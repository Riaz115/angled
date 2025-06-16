import {
  Box,
  Button,
  CircularProgress,
  Rating,
  Typography,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../../api/apiClient";
import { selectUser } from "../../redux/userSlice";
import PdfThumbnails from "../../components/PdfThumbnails";

const EmployerProfessionalDetail = () => {
  const { id } = useParams();
  const [applicantData, setApplicantData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [viewed, setViewed] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [modalImage, setModalImage] = React.useState(null);

  const [viewedItems, setViewedItems] = useState({});
  const [ratingsData, setRatingsData] = useState(null);
  const [viewedCards, setViewedCards] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);

  const getJobApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/professional/${id}/professional_profile/`
      );
      console.log(response, "this is job application response");
      if (response.ok) {
        setApplicantData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of job application response");
      setLoading(false);
    }
  };

  const getProfessionalRatings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/rating/get_professtional_average_ratings/?id=${id}`
      );
      console.log(response, "this is professional ratings response");
      if (response.ok) {
        setRatingsData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of professional ratings response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      getJobApplications();
      getProfessionalRatings();
    }
  }, [id, user]);

  const handleEyeToggle = (file) => {
    setViewedItems((prev) => ({
      ...prev,
      [file]: !prev[file], // Toggle the viewed state for the specific file
    }));
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
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
    <Box className="">
      <Box className="px-sm-5 p-4 d-flex flex-sm-row flex-column gap-sm-0 gap-3 align-items-sm-center align-items-start justify-content-between">
        <Typography className="fw-bold">Professional Details</Typography>
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
        <Box className="row mt-3">
          <Box className="col-lg-3 col-md-4 col-sm-6 col-12 p-1 ">
            <Box>
              <Typography className="text_blue fw-bold">
                Personal Details
              </Typography>
              <img
                src={applicantData?.dp || "/profileDetailPic.svg"}
                className="img-fluid rounded-5 shadow"
                style={{
                  width: "240px",
                  height: "280px",
                  objectFit: "cover",
                  backgroundColor: "#f0f0f0",
                  border: applicantData?.dp ? "none" : "2px dashed #ccc",
                }}
                alt="Profile"
              />
            </Box>
          </Box>

          <Box className="col-lg-3 col-md-4 col-sm-6 col-12 p-2">
            <Box className="d-flex flex-column gap-3 mt-5">
              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Name
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.name || "N/A"}
                </Typography>{" "}
                {/* Handle null or missing name */}
              </Box>

              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Gender
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.gender || "N/A"}
                </Typography>{" "}
                {/* Handle null or missing gender */}
              </Box>

              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Date of Birth
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.dob
                    ? new Date(applicantData.dob).toLocaleDateString()
                    : "N/A"}{" "}
                  {/* Format date if exists */}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Role
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.role?.name || "N/A"}
                </Typography>{" "}
                {/* Handle role null */}
              </Box>
            </Box>
          </Box>

          <Box className="col-lg-3 col-md-4 col-sm-6 col-12 p-1">
            <Typography className="text_blue fw-bold">Address</Typography>
            <Box className="d-flex flex-column gap-3 mt-3">
              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Address Line
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.address?.address || "N/A"}
                </Typography>{" "}
                {/* Check address line */}
              </Box>
            </Box>
          </Box>

          <Box className="col-lg-3 col-md-4 col-sm-6 col-12 p-1">
            <Typography className="text_blue fw-bold">
              Contact Details
            </Typography>
            <Box className="d-flex flex-column gap-3 mt-3">
              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Phone Number
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.phone || "N/A"}
                </Typography>{" "}
                {/* Check phone */}
              </Box>

              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Email
                </Typography>
                <Typography className="fw-bold">
                  {applicantData?.email || "N/A"}
                </Typography>{" "}
                {/* Check email */}
              </Box>
            </Box>
          </Box>

          <Box className="col-lg-3 col-md-4 col-sm-6 col-12 p-1">
            <Typography className="text_blue fw-bold">Career</Typography>
            <Box className="d-flex flex-column gap-3 mt-3">
              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Total Jobs Done
                </Typography>
                <Typography className="fw-bold">
                  {" "}
                  {applicantData?.shift_count?.total_jobs || "0"}
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{ color: "#808080", fontSize: "12px" }}
                  className="fw-bold"
                >
                  Hours Served
                </Typography>
                <Typography className="fw-bold">
                  {" "}
                  {applicantData?.shift_count?.total_hours || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="col-lg-4 col-md-5 col-sm-7 col-12 p-1">
            {/* Ensure ratingsData is not null or undefined, and total_ratings is valid */}
            {ratingsData?.total_ratings > 0 && (
              <>
                <Typography className="text_blue fw-bold">
                  Ratings{" "}
                  <Typography component={"span"} className="text-black">
                    ({ratingsData.total_ratings})
                  </Typography>
                </Typography>

                <Box className="d-flex flex-column mt-3 gap-3">
                  {Object.entries(ratingsData).map(([key, value], index) => {
                    // Skip total_ratings field and any null values
                    if (key === "total_ratings" || value === null) return null;

                    return (
                      <Box
                        className="d-flex justify-content-between align-items-center"
                        key={index}
                      >
                        <Typography className="fw-bold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                        <Box className="d-flex gap-1">
                          <Rating
                            value={value}
                            readOnly
                            sx={{ color: "black" }}
                          />
                          <Typography>{value}/5</Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box className="mt-5 row">
          {[
            { name: "Driver's License", field: "driver_license" },
            { name: "Professional License", field: "professional_license" },
            { name: "Certificates", field: "certification" },
            { name: "Resume", field: "resume" },
            { name: "Other Documents", field: "other_documents" },
          ].map((item, index) => {
            const document = applicantData?.[item.field];
            const file = document?.file;
            const hasFile = file;
            const isImage =
              hasFile &&
              (file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ||
                file.endsWith(".png"));
            const isPdf = hasFile && file.endsWith(".pdf");

            return (
              <Box
                className="col-xl-3 col-md-4 col-sm-6 col-12 p-2 text-center"
                key={index}
              >
                <Typography className="text_blue fw-bold text-start ms-3 mb-3">
                  {item.name}
                </Typography>
                <Box className="position-relative">
                  {hasFile ? (
                    isImage ? (
                      <img
                        src={file}
                        alt={item.name}
                        className="img-fluid mb-3"
                        style={{
                          width: "100%",
                          height: "320px",
                          objectFit: "cover",
                          borderRadius: "20px",
                          filter: viewedItems[file] ? "none" : "blur(4px)", // Individual blur control
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(file)}
                      />
                    ) : isPdf ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "320px",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(file, "_blank")} // Open PDF in a new tab
                      >
                        {/* PDF Thumbnail (Replace with your thumbnail generator) */}
                        <PdfThumbnails
                          pdfFile={file}
                          viewedCards={!viewedItems[file]}
                          index={index} // Optional if you need the index
                        />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "320px",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "20px",
                        }}
                      >
                        <Typography sx={{ color: "#808080", fontSize: "12px" }}>
                          No File
                        </Typography>
                      </Box>
                    )
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "320px",
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "20px",
                      }}
                    >
                      <Typography sx={{ color: "#808080", fontSize: "12px" }}>
                        No File
                      </Typography>
                    </Box>
                  )}

                  {/* Eye Icon */}
                  {hasFile && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 10,
                        cursor: "pointer",
                      }}
                      onClick={() => handleEyeToggle(file)}
                    >
                      {viewedItems[file] ? (
                        <FaEyeSlash size={20} style={{ color: "black" }} />
                      ) : (
                        <FaEye size={20} style={{ color: "black" }} />
                      )}
                    </Box>
                  )}

                  {/* Bottom Overlay */}
                  <Box
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                    }}
                    className="p-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4 d-flex justify-content-between align-items-center"
                    style={{ left: "50%" }}
                  >
                    <Typography sx={{ fontSize: "12px" }}>
                      {hasFile ? item.name : "No File"}
                    </Typography>
                    <Typography
                      component={"span"}
                      sx={{ border: "1px solid black", fontSize: "12px" }}
                      className="p-1 rounded-3"
                    >
                      {hasFile ? "1 File" : "No File"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Modal for Image Preview */}
          <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "90%", // Set max width for responsiveness
                maxHeight: "90%", // Set max height for responsiveness
                bgcolor: "white",
                border: "2px solid #000",
                boxShadow: 24,
                p: 2,
                borderRadius: "15px",
                overflow: "auto", // Ensure scrolling for larger images
              }}
            >
              <Typography
                id="modal-title"
                variant="h6"
                component="h2"
                sx={{ mb: 2 }}
              >
                Image Preview
              </Typography>
              {modalImage && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                >
                  <img
                    src={modalImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "80vh", // Limit height to 80% of the viewport
                      borderRadius: "10px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Modal>
        </Box>
      </Box>

      {/* <Loader loading={loading} setLoading={setLoading} /> */}
    </Box>
  );
};

export default EmployerProfessionalDetail;
