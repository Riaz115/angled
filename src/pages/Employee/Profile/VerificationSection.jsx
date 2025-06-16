import React from "react";
import { Image } from "react-bootstrap";
import Typography from "@mui/material/Typography";

const VerificationSection = ({ width, height, file }) => {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: "20px" }}>
      {/* Image Container */}
      <div
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <Image
          src={
            file
              ? typeof file === "string" && file.startsWith("https://")
                ? file // Use the URL directly if it's a string and starts with "https://"
                : URL.createObjectURL(file) // Otherwise, create an object URL for the file
              : "/gallery.png" // Default fallback
          }
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="Verification Photo"
        />
        {/* <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%', // Width in percentage
            height: '16%', // Height in percentage
            backgroundColor: 'white',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            zIndex: 1,
          }}
        >
          <Typography
            variant="body2"
            style={{
              fontFamily: "Poppins",
              fontSize: "15px",
              fontWeight: 400,
              color: '#000000',
            }}
          >
            Verification Photo
          </Typography>
        </div> */}
      </div>
    </div>
  );
};

export default VerificationSection;
