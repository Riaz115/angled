import { Box, Button, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Loader } from "../../components/Loader/loader";
import apiClient from "../../api/apiClient";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { Link, useParams } from "react-router-dom";
import VerificationSection from "../Employee/Profile/VerificationSection";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiEdit2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { Menu, MenuItem } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import PdfThumbnails from "../../components/PdfThumbnails";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AdminHealthCareProfesionalDetail = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { id } = useParams();
  const [userprofile, setUserprofile] = useState();

  const getUserdata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/facility/api/professional/${id}/`);
      console.log(response, "this is roledata response");
      if (response.ok) {
        setUserprofile(response?.data);
        console.log("ok data riz", response.data);
        // setRole(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      getUserdata();
    }
  }, [user]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [viewedCards, setViewedCards] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const [isHidden, setIsHidden] = useState(false);
  const [doc, setDoc] = useState({
    certification: null,
    driver_license: null,
    other_documents: null,
    professional_license: null,
    resume: null,
  });

  useEffect(() => {
    setDoc({
      certification: userprofile?.certification,
      driver_license: userprofile?.driver_license,
      other_documents: userprofile?.other_documents,
      professional_license: userprofile?.professional_license,
      resume: userprofile?.resume,
    });
  }, [userprofile]);

  const cardsData = [
    { id: 1, title: "Resume", filedata: userprofile?.resume?.file },
    {
      id: 2,
      title: "Certifications",
      filedata: userprofile?.certification?.file,
    },
    {
      id: 3,
      title: "Driver’s License",
      filedata: userprofile?.driver_license?.file,
    },
    {
      id: 4,
      title: "Professional License",
      filedata: userprofile?.professional_license?.file,
    },
    {
      id: 5,
      title: "Additional Document",
      filedata: userprofile?.other_documents?.file,
    },
  ];

  const handleMenuOpen = (event, cardIndex) => {
    console.log(cardIndex, "this is index of card");
    setAnchorEl(event.currentTarget);
    setActiveCard(cardIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    if (action === "edit") {
      setEditCardData(cardsData[activeCard]);
      setIsEditingDocument(true);
    }
    setAnchorEl(null);
  };

  const handleEyeIconClick = (index) => {
    console.log(index, "this is index");
    setViewedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const handleImageClick = (filedata) => {
    setModalImage(filedata);
    setShowModal(true);
  };

  const handleRemoveProfile = async (id, event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await apiClient.delete(`/api/professional/${id}/`);

      if (response.status === 204) {
        toast.success("Profile removed successfully!");
        navigate("/admin/healthcareprofesionals");
      } else {
        toast.error("Failed to remove Profile. Please try again."); // Show error toast
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error removing Profile");
      toast.error("An error occurred while removing the Profile."); // Show error toast
      setLoading(false);
    }
  };

  const handleHideProfile = async (id, event) => {
    event.stopPropagation();
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/api/professional/${id}/hide_professional/`
      );
      if (response.ok) {
        toast.success("Profile Hide successfully!");
        setIsHidden(true);
        getUserdata();
      } else {
        toast.error("Failed to Hide Profile. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error Hide job");
      toast.error("An error occurred while Profile the job.");
      setLoading(false);
    }
  };

  const handleUnhideProfile = async (id, event) => {
    event.stopPropagation();

    try {
      setLoading(true);
      const response = await apiClient.get(
        `/api/professional/${id}/unhide_professional/`
      );
      if (response.ok) {
        toast.success("Profile unHide successfully!");
        setIsHidden(false);
        getUserdata();
      } else {
        toast.error("Failed to unHide Profile. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "Error unHide Profile");
      toast.error("An error occurred while unHide the Profile.");
      setLoading(false);
    }
  };

  return (
    <Box className="">
      <Box className="px-sm-5 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <Typography className="fw-bold">Applicant Details</Typography>
        <Box className="d-flex align-items-center gap-3">
          <>
            {userprofile?.hide ? (
              <Button
                onClick={(event) => {
                  handleUnhideProfile(userprofile.id, event);
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
                UnHide Profile
              </Button>
            ) : (
              <Button
                onClick={(event) => {
                  handleHideProfile(userprofile.id, event);
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
                Hide Profile
              </Button>
            )}
          </>
          <Button
            onClick={(event) => handleRemoveProfile(userprofile.id, event)}
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
            Remove Profile
          </Button>
        </Box>
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
        {userprofile && (
          <>
            <div className="row align-items-start">
              {/* Personal Details Section */}
              <div className="col-md-5 col-12 mb-4">
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#2f80ed",
                    marginBottom: "16px",
                  }}
                >
                  Personal Details
                </Typography>
                <div className="row g-4">
                  <div className="col-12 col-md-6 text-center position-relative mb-3">
                    <VerificationSection
                      width="230px"
                      height="250px"
                      file={userprofile?.dp}
                    />
                  </div>
                  <div className="col-12 col-md-6 mt-3">
                    <p
                      className="mt-3"
                      style={{
                        marginBottom: "0.5rem",
                        color: "#707070",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Name</strong>
                    </p>
                    <p style={{ color: "#000000", fontWeight: 700 }}>
                      {userprofile?.name}
                    </p>

                    <p
                      className="mt-3"
                      style={{
                        marginBottom: "0.5rem",
                        color: "#707070",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Gender</strong>
                    </p>
                    <p style={{ color: "#000000", fontWeight: 700 }}>
                      {userprofile.gender}
                    </p>

                    <p
                      className="mt-3"
                      style={{
                        marginBottom: "0.5rem",
                        color: "#707070",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Date of Birth</strong>
                    </p>
                    <p style={{ color: "#000000", fontWeight: 700 }}>
                      {userprofile?.dob}
                    </p>
                    <p
                      className="mt-3"
                      style={{
                        marginBottom: "0.5rem",
                        color: "#707070",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Employee preference</strong>
                    </p>
                    <p style={{ color: "#000000", fontWeight: 700 }}>
                      {userprofile?.role?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="col-md-3 col-12 mb-4">
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#2b80ed",
                    marginBottom: "16px",
                  }}
                >
                  Address
                </Typography>
                <p
                  className="mt-3"
                  style={{
                    marginBottom: "0.5rem",
                    color: "#707070",
                    fontSize: "16px",
                  }}
                >
                  <strong>Address Line</strong>
                </p>
                <p style={{ color: "#000000", fontWeight: 700 }}>
                  {userprofile?.address?.address}
                </p>

                <p style={{ color: "#000000", fontWeight: 700 }}>
                  {userprofile?.address?.country}
                </p>
              </div>

              {/* Contact Details Section */}
              <div className="col-md-3 col-12 mb-4">
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#2b80ed",
                    marginBottom: "16px",
                  }}
                >
                  Contact Details
                </Typography>
                <p
                  className="mt-3"
                  style={{
                    marginBottom: "0.5rem",
                    color: "#707070",
                    fontSize: "16px",
                  }}
                >
                  <strong>Phone Number</strong>
                </p>
                <p style={{ color: "#000000", fontWeight: 700 }}>
                  {userprofile?.phone}
                </p>

                <p
                  className="mt-3"
                  style={{
                    marginBottom: "0.5rem",
                    color: "#707070",
                    fontSize: "16px",
                  }}
                >
                  <strong>Email</strong>
                </p>
                <p style={{ color: "#000000", fontWeight: 700 }}>
                  {userprofile?.email}
                </p>
              </div>
            </div>
            <div className="col-md-4 col-12 mb-4">
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  color: "#2b80ed",
                  marginBottom: "16px",
                }}
              >
                Career
              </Typography>
              <p
                className="my-2"
                style={{
                  marginBottom: "0.5rem",
                  color: "#707070",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                <strong>Total Jobs Done</strong>
              </p>
              <p style={{ color: "#000000", fontWeight: 700 }}>59</p>

              <p
                className="my-2"
                style={{
                  marginBottom: "0.5rem",
                  color: "#707070",
                  fontSize: "16px",
                }}
              >
                <strong>Hours Served</strong>
              </p>
              <p style={{ color: "#000000", fontWeight: 700 }}>456</p>
            </div>
          </>
        )}
        <div className="container-fluid mt-5">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {cardsData.map((card, index) => (
              <div
                key={card.id}
                style={{
                  borderRadius: "15px",
                }}
              >
                {card.filedata && (
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "20px",
                      fontWeight: "500",
                      lineHeight: "30px",
                      letterSpacing: "0.01em",
                      textAlign: "left",
                      color: "#2F80ED",
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </h3>
                )}
                {card.filedata && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "350px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      transition: "filter 0.3s ease",
                    }}
                  >
                    {/* Image or PDF Display */}
                    {card?.filedata ? (
                      typeof card?.filedata === "string" &&
                        card?.filedata.startsWith("https://") ? (
                        // Handle AWS file URL
                        card?.filedata.includes(".pdf") ? (
                          <PdfThumbnails
                            pdfFile={card?.filedata}
                            viewedCards={viewedCards[index]}
                            pageIndex={0}
                          />
                        ) : (
                          <img
                            className="cursor-pointer"
                            src={card?.filedata}
                            alt={card.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover", // Ensures full coverage of the div
                              filter: viewedCards[index] ? "blur(4px)" : "none",
                              opacity: viewedCards[index] ? 0.9 : 1,
                            }}
                            onClick={() => handleImageClick(card.filedata)}
                          />
                        )
                      ) : // Handle file uploaded directly from local
                        card?.filedata?.type === "application/pdf" ? (
                          <PdfThumbnails
                            pdfFile={URL.createObjectURL(card?.filedata)}
                            viewedCards={viewedCards[index]}
                            pageIndex={0}
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(card?.filedata)}
                            alt={card.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover", // Ensures full coverage of the div
                              filter: viewedCards[index] ? "blur(4px)" : "none",
                              opacity: viewedCards[index] ? 0.9 : 1,
                            }}
                          />
                        )
                    ) : (
                      <img
                        src="https://via.placeholder.com/240x300"
                        alt="Verification"
                        style={{
                          width: "100%",
                          height: "350px",
                          objectFit: "cover",
                          filter: viewedCards[index] ? "blur(4px)" : "none",
                          opacity: viewedCards[index] ? 0.9 : 1,
                        }}
                      />
                    )}

                    {/* Eye Icon */}
                    <div
                      style={{
                        zIndex: 10, // Ensure this element is above others
                        position: "absolute",
                        top: "10px",
                        display: "flex",
                        justifyContent: "end",
                        width: "100%",
                        padding: "0 10px",
                        cursor: "pointer",
                      }}
                    >
                      {viewedCards[index] ? (
                        <FaEye
                          size={20}
                          style={{
                            fontSize: "18px",
                            color: "black",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEyeIconClick(index)}
                        />
                      ) : (
                        <FaEyeSlash
                          size={20}
                          style={{
                            fontSize: "18px",
                            color: "black",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEyeIconClick(index)}
                        />
                      )}
                    </div>

                    {/* Bottom Overlay */}
                    <div
                      style={{
                        backgroundColor: "#FFFFFFCC",
                        width: "90%",
                        height: "50px",
                        position: "absolute",
                        bottom: "10px",
                        left: "15px",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "15px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: "400",
                          lineHeight: "18px",
                          textAlign: "left",
                        }}
                      >
                        {card.title}
                      </p>
                      <div
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "12px",
                          fontWeight: "500",
                          lineHeight: "19.5px",
                          color: "black",
                          letterSpacing: "0.01em",
                          textAlign: "center",
                          padding: "8px",
                          border: "1px solid black",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Link
                          to={card?.filedata}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          File
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => handleMenuAction("edit")}
              disableRipple
              sx={{
                display: "flex",
                alignItems: "center",
                // color: "black",
                gap: "8px",
                color: "#0044ff",
                "&:hover": {
                  backgroundColor: "#E7F0FA",
                },
              }}
            >
              <RiEdit2Fill style={{ fontSize: "18px" }} />
              Edit
            </MenuItem>
            {/* <MenuItem
          onClick={ () => handleMenuAction( 'delete' ) }
          disableRipple
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'red',
            '&:hover': {

              backgroundColor: '#E7F0FA',
            },
          } }
        >
          <RiDeleteBin6Line style={ { fontSize: '18px' } } />
          Delete
        </MenuItem> */}
          </Menu>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Image Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalImage && (
                <img
                  src={modalImage}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />
              )}
            </Modal.Body>
          </Modal>
        </div>
      </Box>
      <Loader loading={loading} />
    </Box>
  );
};

export default AdminHealthCareProfesionalDetail;
