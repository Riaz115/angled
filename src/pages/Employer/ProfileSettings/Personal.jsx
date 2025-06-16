import React from "react";
import { Button } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { removeAuthToken } from "../../../api/apiClient";

const Personal = ({ setIsEditing, userprofile }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-2 w-100 h-full d-flex align-items-center align-items-center">
      <div className="container-fluid mt-3 w-80 justify-content-center">
        {userprofile && (
          <div className="row align-items-start">
            {/* Personal Details Section */}
            <div className="col-md-12 col-lg-6    col-12 mb-4">
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
              <div className="row g-4 align-items-center">
                <div className="col-12 col-md-6 text-center position-relative mb-3">
                  <img
                    src={userprofile?.dp}
                    alt="Profile"
                    style={{
                      width: "230px",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
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
                    <strong>Email</strong>
                  </p>
                  <p style={{ color: "#000000", fontWeight: 500 }}>
                    {userprofile?.user?.email}
                  </p>

                  <p
                    className="mt-3"
                    style={{
                      marginBottom: "0.5rem",
                      color: "#707070",
                      fontSize: "16px",
                    }}
                  >
                    <strong>Phone</strong>
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
                    <strong> Profile Type</strong>
                  </p>
                  <p style={{ color: "#000000", fontWeight: 500 }}>
                    {userprofile?.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Webiste Section */}
            <div className="col-md-6 col-lg-3 col-12 mb-4">
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  color: "#2b80ed",
                  marginBottom: "16px",
                }}
              >
                Webiste
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
            <div className="col-md-6 col-lg-3 col-12 mb-4">
              <Typography
                variant="h6"
                style={{
                  fontWeight: "bold",
                  color: "#2b80ed",
                  marginBottom: "16px",
                }}
              >
                Other Details
              </Typography>
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
                {userprofile?.speciality}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="light"
          style={{
            backgroundColor: "#dce1f7",
            color: "#004FFF",
            padding: "13px",
            fontWeight: "500",
            width: "150px",
            marginTop: "12px",
          }}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
        <Button
          variant="primary"
          className="mx-2"
          style={{
            // backgroundColor: '#dce1f7',
            // color: '#004FFF',
            padding: "13px",
            fontWeight: "500",
            width: "150px",
            marginTop: "12px",
          }}
          onClick={() => {
            localStorage.removeItem("USER_STRING");
            navigate("/");
            removeAuthToken();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Personal;
