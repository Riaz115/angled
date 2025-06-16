import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineContactPage } from "react-icons/md";
import { SlNote } from "react-icons/sl";
import { TbMessageDots } from "react-icons/tb";
import { HiBars3BottomLeft } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaCaretDown, FaCaretRight } from "react-icons/fa"; // For dropdown indicators
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { LuUser2 } from "react-icons/lu";
import { removeAuthToken } from "../api/apiClient";

const drawerWidthExpanded = 250;
const drawerWidthCollapsed = 100;

function SideNav({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  type,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // State for user dropdown
  const isAbove900 = useMediaQuery("(min-width:900px)");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  let listItemData =
    type === "admin"
      ? [
        {
          label: "Dashboard",
          link: "/admin/dashboard",
          icon: <MdOutlineDashboard size={22} />,
        },
        {
          label: "Users",
          icon: <LuUser2 />,
          children: [
            {
              label: "Healthcare Professionals",
              link: "/admin/healthcareprofesionals",
            },
            { label: "Employers", link: "/admin/employer" },
          ],
        },
        { label: "Jobs", link: "/admin/jobs", icon: <SlNote size={22} /> },
        {
          label: "Messages",
          link: "/admin/messages",
          icon: <TbMessageDots size={22} />,
        },
      ]
      : [
        {
          label: "Dashboard",
          link: "/employer/dashboard",
          icon: <MdOutlineDashboard size={22} />,
        },
        {
          label: "Applicants",
          link: "/employer/applicants",
          icon: <MdOutlineContactPage size={22} />,
        },
        { label: "Jobs", link: "/employer/jobs", icon: <SlNote size={22} /> },
        {
          label: "Messages",
          link: "/employer/messages",
          icon: <TbMessageDots size={22} />,
        },
      ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        color: "#fff",
        p: 1,
        boxSizing: "border-box",
        zIndex: 200,
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        {!isCollapsed ? (
          <Box
            className="d-flex flex-row justify-content-center w-100"
            onClick={toggleCollapse}
            sx={{ cursor: "pointer" }}
          >
            <img src="/dashboardLogo.svg" alt="" className="img-fluid" />
          </Box>
        ) : (
          <Box
            className="d-flex flex-row justify-content-center"
            onClick={toggleCollapse}
            sx={{ cursor: "pointer", width: "40px" }}
          >
            <img src="/dashboardLogoSmall.svg" alt="" className="img-fluid" />
          </Box>
        )}
      </Box>

      <List className="mt-5 mb-5">
        {listItemData.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              component={item.link ? NavLink : "div"}
              to={item.link}
              className="rounded-5"
              disablePadding
              sx={{
                display: "flex",
                color: location.pathname.includes(
                  item.children?.find(
                    (child) => child.link === location.pathname
                  )?.link
                )
                  ? "#004fff"
                  : "black",

                justifyContent: isCollapsed ? "center" : "flex-start",
                mb: 1,
                "&.active": {
                  bgcolor: "#dde4f6",
                  color: "#004fff",
                },
                "&:hover": {
                  bgcolor: "#f2f2f2",
                },
              }}
              onClick={item.children ? toggleUserDropdown : null}
            >
              <ListItemButton
                sx={{
                  display: "flex",
                  justifyContent: isCollapsed ? "center" : "space-between", // Align elements
                  alignItems: "center",
                  px: isCollapsed ? 2 : 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      sx={{
                        color: "inherit",
                        ml: 2,
                      }}
                    />
                  )}
                </Box>
                {!isCollapsed && item.children && (
                  <Box>
                    {userDropdownOpen ? (
                      <IoIosArrowDown size={20} />
                    ) : (
                      <IoIosArrowBack size={20} />
                    )}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={userDropdownOpen} timeout="auto" unmountOnExit>
                {item.children.map((child, childIndex) => (
                  <ListItem
                    component={NavLink}
                    to={child.link}
                    key={`${index}-${childIndex}`} // Add a key for each child
                    sx={{
                      ml: 1,
                      p: 1,
                      fontSize: "14px",
                      color: "black",
                      "&.active": {
                        color: "#004fff",
                        borderLeft: "2px solid #004fff",
                      },
                      "&:hover": {
                        color: "#004fff",
                      },
                    }}
                  >
                    <ListItemButton
                      sx={{
                        py: 0.5, // Reduce vertical padding to make the height smaller
                        minHeight: "30px", // Set a minimum height
                        "& .MuiListItemText-root": {
                          fontSize: "14px", // Adjust font size for smaller appearance
                        },
                      }}
                    >
                      <ListItemText
                        sx={{ fontSize: "12px" }}
                        primary={child.label}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <hr
        style={{
          border: 0,
          height: "1px",
          backgroundColor: "#000",
        }}
      />

      <Box
        className="d-flex flex-row align-items-center"
        sx={{
          paddingLeft: "20px",
          backgroundColor: "#f5f5f5", // Ensures the background is light
          color: "black", // Ensures text is visible with contrast
          cursor: "pointer", // Optional: Makes the section clickable
        }}
        onClick={() => {
          if (type === "admin") {
            navigate("/admin/settings");
          } else {
            navigate("/employer/settings");
          }
        }}
      >
        <IconButton sx={{ color: "black" }}>
          <IoSettingsOutline size={20} />
        </IconButton>
        {!isCollapsed && (
          <Typography
            className="fontstyleText text-dark"
            sx={{ ml: 2, color: "black", cursor: "pointer", fontSize: "14px" }}
          >
            Setting
          </Typography>
        )}
      </Box>

      <Box
        className="d-flex flex-row align-items-center"
        sx={{
          mt: "auto",
          p: 2,
        }}
        onClick={() => {
          localStorage.removeItem("USER_STRING");
          navigate("/");
          removeAuthToken();
        }}
      >
        <IconButton sx={{ color: "black" }}>
          <HiBars3BottomLeft size={20} />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        flexShrink: 0,
        transition: "width 0.3s",
        display: isAbove900 ? "block" : "none",
        zIndex: 200,
      }}
      aria-label="side navigation"
    >
      <Drawer
        variant={isAbove900 ? "permanent" : "temporary"}
        sx={{
          "& .MuiDrawer-paper": {
            width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            bgcolor: "#f5f5f5",
            color: "#fff",
            boxSizing: "border-box",
            transition: "width 0.3s",
            zIndex: 200,
          },
        }}
        open={mobileOpen || isAbove900}
        onClose={setMobileOpen}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

SideNav.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  setMobileOpen: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default SideNav;
