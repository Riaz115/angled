import { Alert, Box } from "@mui/material";
import React from "react";

const Driver = ({ handleChange, errors, formData }) => {
  return (
    <Box className="col-lg-8 col-md-7">
      <Box className="row">
        <Box className="col-lg-6 mt-3">
          <label style={{ color: "#909090", fontWeight: 600 }}>CNIC *</label>
          <input
            type="text"
            name="cnic"
            placeholder="XXXXX-XXXXXXX-X"
            className={`form-control ${errors.cnic ? "is-invalid" : ""} mb-1`}
            value={formData?.cnic}
            onChange={handleChange}
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              height: "45px",
              outline: "none",
            }}
          />
          {errors.cnic && (
            <Alert severity="error" sx={{ width: "100%" }}>
              CNIC is required
            </Alert>
          )}
        </Box>

        <Box className="col-lg-6 mt-3">
          <label style={{ color: "#909090", fontWeight: 600 }}>
            License Number *
          </label>
          <input
            type="text"
            name="licenseNumber"
            placeholder="Enter License Number"
            className={`form-control ${
              errors.licenseNumber ? "is-invalid" : ""
            } mb-1`}
            value={formData.licenseNumber}
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
              License number is required
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
            name="licenseExpiry"
            className={`form-control ${
              errors.licenseExpiry ? "is-invalid" : ""
            } mb-1`}
            value={formData.licenseExpiry}
            onChange={handleChange}
            style={{
              backgroundColor: "#ffffff",
              border: "none",
              height: "45px",
              outline: "none",
            }}
          />
          {errors.licenseExpiry && (
            <Alert severity="error" sx={{ width: "100%" }}>
              License Expiry Date is required
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Driver;
