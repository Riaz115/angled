import React, { useState } from "react";
import { Box, Tabs, Tab, useMediaQuery } from "@mui/material";
import Subscribed from "../../components/AdminEmployerTabs/Subscribed";
import NonSubscribed from "../../components/AdminEmployerTabs/NonSubscribed";

const AdminEmployers = () => {
  const [currentTab, setCurrentTab] = useState(0);

  // Detect screen size
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF" }}>
      {/* Tabs */}
      {/* <Box
        className="d-flex justify-content-center mt-1"
        sx={{ bgcolor: "#f1f2f4" }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          sx={{
            borderBottom: "1px solid #ddd",
            width: isSmallScreen ? "90%" : "30%", // Adjust width based on screen size
            maxWidth: "1200px",
          }}
        >
          <Tab
            label="Subscribed"
            sx={{
              color: currentTab === 0 ? "#0a65cc" : "#636a80",
              textTransform: "none",
              fontWeight: currentTab === 0 ? "bold" : "normal",
              fontSize: isSmallScreen ? "14px" : "18px", // Smaller font size for small screens
            }}
          />
          <Tab
            label="Non-Subscribed"
            sx={{
              color: currentTab === 1 ? "#0a65cc" : "#636a80",
              textTransform: "none",
              fontWeight: currentTab === 1 ? "bold" : "normal",
              fontSize: isSmallScreen ? "14px" : "18px", // Smaller font size for small screens
            }}
          />
        </Tabs>
      </Box> */}

      {/* Tab Panels */}
      <Box>
        {currentTab === 0 && <Subscribed />}
        {/* {currentTab === 1 && <NonSubscribed />} */}
      </Box>
    </Box>
  );
};

export default AdminEmployers;
