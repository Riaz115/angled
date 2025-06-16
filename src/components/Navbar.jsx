import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

import activeicon from "../assets/fonts/Ellipse 1146.png";
import logoimage from "../assets/fonts/Picsart_24-10-02_16-28-04-574 1.png";
import { Avatar, Badge } from "@mui/material";
import avatarimage from "../assets/fonts/Ellipse 1.png";
import { NotificationsActive } from "@mui/icons-material";
import apiClient from "../api/apiClient";
import { Loader } from "./Loader/loader";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { toast } from "react-toastify";
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userprofile, setUserprofile] = useState();
  const user = useSelector(selectUser);

  const getUserdata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        "/professional/api/professional/my_profile/"
      );
      console.log(response, "this is roledata response");
      if (response.status === 401) {
        toast.error("Admin Maybe removed you");
        navigate("/sign-up");
      }
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

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? "#004FFF" : "#000",
    fontWeight: location.pathname === path ? "bold" : "normal",
  });

  return (
    <div className="d-flex flex-column">
      <div
        className="container-fluid-sm"
        style={{ boxShadow: "0px 3px 4px 0px rgba(0,0,0,0.1)" }}
      >
        <div className="mycontainer ms-4 px-sm-4 px-0">
          <nav className="navbar navbar-expand-lg navbar-light navbg text-dark">
            <Link to="/find-employee/job" style={{ textDecoration: "none" }}>
              <img width={"70px"} src={logoimage} alt="" className="ms-4" />
            </Link>

            <div className="d-flex flex-md-row flex-column justify-content-between w-lg-not-100 align-items-center">
              <span className="ms-auto">
                <button
                  className="navbar-toggler navbar-togl-btn border-0"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="navbar-toggler-icon text-white"></span>
                </button>
              </span>
            </div>
            <div
              className={`p-3 collapse navbar-collapse ${
                isMobileMenuOpen ? "show" : ""
              }`}
              id="navbarSupportedContent"
            >
              <div className="d-md-flex w-100 justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-5">
                  <div className="d-flex justify-content-between align-items-center gap-2">
                    <Link
                      to="/find-employee/job"
                      className="text-decoration-none"
                    >
                      <p
                        className="m-0"
                        style={getLinkStyle("/find-employee/job")}
                      >
                        Find Job
                      </p>
                    </Link>
                    |
                    <Link to="/employee/job/" className="text-decoration-none">
                      <p className="m-0" style={getLinkStyle("/employee/job/")}>
                        My Job
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="justify-content-between align-items-center d-flex gap-3">
                  <div className="">
                    <div
                      className="rounded-5 py-2 d-flex justify-content-between align-items-center gap-3 px-4"
                      style={{ backgroundColor: "#E5EDFF", color: "#004FFF" }}
                    >
                      <div>
                        <img src={activeicon} alt="" />
                      </div>
                      <h6 className="m-0">Active</h6>
                    </div>
                  </div>
                  <HiOutlineChatBubbleLeftRight size={20} />
                  <Badge variant="dot" color="error">
                    <NotificationsActive color="action" />
                  </Badge>
                  <div className="justify-content-between align-items-center d-flex flex-column">
                    <h6> {user?.name}</h6>
                    <p style={{ fontSize: "12px" }}>Healthcare Professional</p>
                  </div>
                  <Avatar
                    sx={{
                      width: "60px",
                      height: "60px",
                      cursor: "pointer",
                      bgcolor: "#1976d2", // Background color (optional)
                      color: "#fff", // Text color (optional)
                    }}
                    onClick={() => navigate("/profile")}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </div>
              </div>

              <div className="d-flex order-mbl3 align-items-center gap-4"></div>
            </div>
          </nav>
        </div>
      </div>

      <div
        className="d-flex justify-content-between align-items-center px-3 d-md-none"
        style={{ backgroundColor: "white" }}
      >
        <Link
          style={{ fontSize: "25px" }}
          className="ms-2 text-white fs-bold text-decoration-none"
          to="/"
        >
          <div className="" style={{ width: "6rem" }}></div>
        </Link>
      </div>

      <main
        className="mt-sm-0 px-0"
        style={{ overflow: "auto", minHeight: "60vh" }}
      >
        <Outlet context={{ userprofile, setUserprofile }} />
      </main>
      <Loader loading={loading} />
    </div>
  );
};

export default Navbar;
