import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Dashboardnav = ({ type }) => {
  const isAbove576 = useMediaQuery("(min-width:576px)");
  return (
    <Box
      className=""
      sx={{
        backgroundColor: "#E9E9E9",
        minHeight: "100vh",
      }}
    >
      <Box
        className=""
        sx={{ display: "flex", backgroundColor: "#E9E9E9", height: "100vh" }}
      >
        <CssBaseline />
        <Header type={type} />
        <Box
          className=" scroll"
          style={{
            backgroundColor: "#E9E9E9",
            borderRadius: "20px",
            height: "calc(100vh - 8px)",
            scrollbarWidth: "none",
          }}
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            paddingTop: isAbove576 ? "90px" : "70px",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboardnav;
