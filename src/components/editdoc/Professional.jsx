import { Alert, Box } from "@mui/material";
import React from "react";

const Professional = ({ handleChange, errors, formData }) => {
  return (
    <Box className="col-lg-8 col-md-7">
      <Box className="row">
        <Box className="col-lg-6 mt-3">
          <label style={{ color: "#909090", fontWeight: 600 }}>
            Issued By *
          </label>
          <input
            type="text"
            name="companyname"
            placeholder="Enter Company Name"
            className={`form-control ${
              errors.companyname ? "is-invalid" : ""
            } mb-1`}
            value={formData.companyname}
            onChange={handleChange}
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              height: "45px",
              outline: "none",
            }}
          />
          {errors.companyname && (
            <Alert severity="error" sx={{ width: "100%" }}>
              Company Name is required
            </Alert>
          )}
        </Box>
        <Box className="col-lg-6 mt-3">
          <label style={{ color: "#909090", fontWeight: 600 }}>
            License Number *
          </label>
          <input
            type="text"
            name="plicenseNumber"
            placeholder="Enter License Number"
            className={`form-control ${
              errors.plicenseNumber ? "is-invalid" : ""
            } mb-1`}
            value={formData?.plicenseNumber}
            onChange={handleChange}
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              height: "45px",
              outline: "none",
            }}
          />
          {errors.licenseNumber && (
            <Alert severity="error" sx={{ width: "100%" }}>
              License Number is required
            </Alert>
          )}
        </Box>

        <Box className="col-lg-6 mt-3">
          <label style={{ color: "#909090", fontWeight: 600 }}>
            Date of Expiry *
          </label>
          <input
            min={new Date().toISOString().split("T")[0]}
            type="date"
            name="professionalExpiry"
            className={`form-control ${
              errors.professionalExpiry ? "is-invalid" : ""
            } mb-1`}
            value={formData.professionalExpiry}
            onChange={handleChange}
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              height: "45px",
              outline: "none",
            }}
          />
          {errors.professionalExpiry && (
            <Alert severity="error" sx={{ width: "100%" }}>
              Date of Expiry is required
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Professional;
