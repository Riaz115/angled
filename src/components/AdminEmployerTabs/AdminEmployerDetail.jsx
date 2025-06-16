import { Box, Button, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Loader } from "../../components/Loader/loader";
import apiClient from "../../api/apiClient";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { useParams } from "react-router-dom";
import { FaEllipsisV, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiEdit2Fill, RiDeleteBin6Line } from "react-icons/ri";
import { Menu, MenuItem } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VerificationSection from "../../pages/Employee/Profile/VerificationSection";
import { toast } from "react-toastify";

const AdminEmployerDetail = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isHidden, setIsHidden] = useState(false);
  const [userprofile, setUserprofile] = useState();

  const getUserdata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/facility/${id}/`);
      console.log(response, "this is  response");
      if (response.ok) {
        setUserprofile(response?.data);
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

  const handleRemoveProfile = async (id, event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await apiClient.delete(`/api/facility/${id}/`);

      if (response.status === 204) {
        toast.success("Profile removed successfully!");
        navigate("/admin/employer");
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
        `/api/facility/${id}/hide_facility/`
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
        `/api/facility/${id}/unhide_facility/`
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
        <Typography className="fw-bold">Employer Details</Typography>
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
            Remove
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
          <div className="row align-items-start">
            {/* Personal Details Section */}
            <div className="col-md-12 col-lg-4   col-12 mb-4">
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
              <div className="row g-2">
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
                  <p style={{ color: "#000000", fontWeight: 500 }}>
                    {userprofile?.user?.name}
                  </p>

                  <p
                    className="mt-3"
                    style={{
                      marginBottom: "0.5rem",
                      color: "#707070",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Founded Date</strong>
                  </p>
                  <p style={{ color: "#000000", fontWeight: 500 }}>
                    {userprofile?.founded_date}
                  </p>
                  <p
                    className="mt-3"
                    style={{
                      marginBottom: "0.5rem",
                      color: "#707070",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Speciality</strong>
                  </p>
                  <p style={{ color: "#000000", fontWeight: 500 }}>
                    {userprofile?.speciality || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="col-md-6 col-lg-4 col-12 mb-4">
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  color: "#2b80ed",
                  marginBottom: "16px",
                }}
              >
                Website
              </Typography>
              <p
                className="mt-3"
                style={{
                  marginBottom: "0.5rem",
                  color: "#707070",
                  fontSize: "16px",
                }}
              >
                <strong>Website</strong>
              </p>
              <p style={{ color: "#000000", fontWeight: 500 }}>
                <a
                  href={userprofile?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#004FFF" }}
                >
                  {userprofile?.website || "N/A"}
                </a>
              </p>
            </div>

            {/* Contact Details Section */}
            <div className="col-md-6 col-lg-4 col-12 mb-4">
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
              <p style={{ color: "#000000", fontWeight: 500 }}>
                {userprofile?.user?.phone}
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
              <p style={{ color: "#000000", fontWeight: 500 }}>
                {userprofile?.user?.email}
              </p>
            </div>
          </div>
        )}
      </Box>
      <Loader loading={loading} />
    </Box>
  );
};

export default AdminEmployerDetail;
