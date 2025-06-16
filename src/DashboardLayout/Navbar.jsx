import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Hidden,
  IconButton,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NotificationsActive } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import NavModal from "./NavModal";

function Navbar({ handleDrawerToggle, isCollapsed, mobileOpen }) {
  const isAbove900 = useMediaQuery("(min-width:900px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const user = useSelector(selectUser);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    console.log("how this is possible");
    setShowModal(false);
  };

  console.log(user, "This is user Profile data");

  return (
    <>
      <AppBar
        className="shadow-md"
        position="fixed"
        sx={{
          boxShadow: "0",
          width:
            !isCollapsed && isAbove900
              ? `calc(100% - 250px)`
              : isCollapsed && isAbove900
              ? `calc(100% - 100px)`
              : "100%",
          transition: "width 0.3s",
          backgroundColor: "white",
          zIndex: 300,
        }}
      >
        <Box className="d-flex align-items-center justify-content-between px-sm-5 px-3 py-3 w-100">
          <Typography className="fw-bold fs-3 text-black">
            {location.pathname.startsWith("/admin/healthcareprofesionals")
              ? "Healthcare Professionals"
              : location.pathname.startsWith("/admin/employer")
              ? "Employer"
              : "Dashboard"}
          </Typography>

          <Box className="d-flex align-items-center gap-3">
            <Box>
              {location.pathname === "/admin/employer" ? (
                <Button
                  className="outline"
                  sx={{
                    fontSize: "16px",
                    padding: "6px 12px",
                    color: "#004FFF",
                    backgroundColor: "#e5edff",
                    fontWeight: 500,
                  }}
                  onClick={handleOpenModal} // Open the modal when clicked
                >
                  Add User
                </Button>
              ) : location.pathname === "/admin/dashboard" ? (
                <Box
                  className="d-flex flex-row align-items-center rounded-5 px-4 py-2 gap-2 d-none d-sm-flex"
                  style={{ backgroundColor: "#E5EDFF", color: "#004FFF" }}
                >
                  <Box>
                    <img src="/greenDot.png" alt="Active" />
                  </Box>
                  <Typography className="m-0">Active</Typography>
                </Box>
              ) : (
                !location.pathname.startsWith("/admin") && (
                  <Box
                    className="d-flex flex-row align-items-center rounded-5 px-4 py-2 gap-2 d-none d-sm-flex"
                    style={{ backgroundColor: "#E5EDFF", color: "#004FFF" }}
                  >
                    <Box>
                      <img src="/greenDot.png" alt="Active" />
                    </Box>
                    <Typography className="m-0">Active</Typography>
                  </Box>
                )
              )}
            </Box>

            <Badge variant="dot" color="error">
              <NotificationsActive color="action" />
            </Badge>
            <Box className="d-flex flex-column align-items-center d-none d-md-block">
              <Typography className="text-dark fw-bold fontstylelabel">
                {user?.name}
              </Typography>
              <Typography className="text-dark" style={{ fontSize: "12px" }}>
                {user?.type === "A" ? "Admin" : "employer"}
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: "50px",
                height: "50px",
                cursor: "pointer",
                bgcolor: "#1976d2",
                color: "#fff",
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Hidden mdUp>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon
                  style={{
                    color: "black",
                  }}
                />
              </IconButton>
            </Hidden>
          </Box>
        </Box>
      </AppBar>
      <NavModal showModal={showModal} handleCloseModal={handleCloseModal} />
    </>
  );
}

export default Navbar;
