import React from "react";
import { Button } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import VerificationSection from "./VerificationSection";
import { useNavigate } from "react-router-dom";
import { removeAuthToken } from "../../../api/apiClient";

const Personal = ({ setIsEditing, userprofile }) => {
  
  const navigate = useNavigate();
  return (
    <div className="container-fluid mt-3 w-80">
      {userprofile && (
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
                <p style={{ color: "#000000", fontWeight: 500 }}>
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
                <p style={{ color: "#000000", fontWeight: 500 }}>
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
                <p style={{ color: "#000000", fontWeight: 500 }}>
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
                <p style={{ color: "#000000", fontWeight: 500 }}>
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
            <p style={{ color: "#000000", fontWeight: 500 }}>
              {userprofile?.address?.address}
            </p>

            {/* <p className='mt-3' style={{ marginBottom: '0.5rem', color: '#707070', fontSize: '16px' }}>
                        <strong>City</strong>
                    </p>
                    <p style={{ color: '#000000', fontWeight: 500 }}>{userprofile?.address?.city}</p>

                    <p  className='mt-3' style={{ marginBottom: '0.5rem', color: '#707070', fontSize: '16px' }}>
                        <strong>State</strong>
                    </p>
                    <p style={{ color: '#000000', fontWeight: 500 }}>{userprofile?.address?.state}</p>

                    <p className='mt-3' style={{ marginBottom: '0.5rem', color: '#707070', fontSize: '16px' }}>
                        <strong>Country</strong>
                    </p> */}
            <p style={{ color: "#000000", fontWeight: 500 }}>
              {userprofile?.address?.country}
            </p>
          </div>

          {/* Contact Details Section */}
          <div className=" col-md-3 col-12 mb-4">
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
            <p style={{ color: "#000000", fontWeight: 500 }}>
              {userprofile?.email}
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
  );
};

export default Personal;
