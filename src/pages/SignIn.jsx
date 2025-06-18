import { Box, Typography, Button, Alert } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import ForgetPasswordModal from "../modals/ForgetPasswordModal";
import WrongCredentialsModal from "../modals/WrongCredentialsModal";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import apiClient from "../api/apiClient";
import { Loader } from "../components/Loader/loader";
import { toast } from "react-toastify";
import { encryptUserData } from "../api/reuse";
import { encryptKey } from "../config";
import { addUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const [passwordtype, setpasswordtype] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showForgetPasswordModal, setshowForgetPasswordModal] = useState(false);
  const [showWrongCredentialsModal, setshowWrongCredentialsModal] =
    useState(false);
  const dispatch = useDispatch();

  // Add debugging to check if component is rendering
  useEffect(() => {
    console.log("SignIn component mounted");
    console.log("API Base URL:", import.meta.env.VITE_API_URL);
  }, []);

  const handleSignIn = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email and password
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
      return;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post("/api/users/login/", {
        email: email,
        password: password,
      });

      setLoading(false);

      if (response.ok) {
        const { deleted, active, id, user, access } = response?.data;

        localStorage.setItem("userid", id);

        // Check if the account is deleted
        if (deleted === "True") {
          toast.error("Your account has been blocked by Admin");
        }
        // Check if the account is inactive and not deleted
        else if (active === "False" && deleted === "False") {
          navigate(`/otpset/${id}`);
        }
        // Handle active user
        else {
          dispatch(addUser({ access, ...user }));
          const admin = encryptUserData({ access, ...user }, encryptKey);
          localStorage.setItem("USER_STRING", JSON.stringify(admin));

          if (user?.profile_completed) {
            if (user.type === "P") {
              navigate("/profile");
            } else if (user.type === "F") {
              navigate("/employer/dashboard");
            } else {
              navigate("/admin/dashboard");
            }
          } else {
            navigate("/create-profile");
          }
        }
      } else {
        if (
          response.status === 400 &&
          response.data?.active === "False" &&
          response.data?.deleted === "False"
        ) {
          navigate(`/otpset/${response.data.id}`);
        } else if (
          response.status === 400 &&
          response.data?.active === "False" &&
          response.data?.deleted === "True"
        ) {
          toast.error("Your account has been blocked by Admin");
        } else {
          if (!toast.isActive("invalid-credentials")) {
            toast.error("Invalid Credentials", {
              toastId: "invalid-credentials",
            });
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <Box className="d-flex flex-row w-100" sx={{ height: "100vh" }}>
      {/* Debug test div */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        background: 'red', 
        color: 'white', 
        padding: '10px', 
        zIndex: 9999 
      }}>
        SignIn Component is rendering!
      </div>
      
      <ForgetPasswordModal
        show={showForgetPasswordModal}
        onHide={() => setshowForgetPasswordModal(false)}
      />
      <WrongCredentialsModal
        show={showWrongCredentialsModal}
        onHide={() => setshowWrongCredentialsModal(false)}
      />
      <Box
        className="w-100 p-5 bg_primary"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/signatureBG.svg')",
          backgroundPosition: "center bottom 50px",
          backgroundRepeat: "no-repeat",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: {
              xs: "90%",
              sm: "80%",
              md: "80%",
              lg: "70%",
            },
            maxWidth: "500px",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
            className="d-flex flex-column align-items-center gap-3"
          >
            <Box className="text-center mt-3 mb-4">
              <img src="/signUpLogo.svg" alt="Logo" className="img-fluid" />
            </Box>
            <Typography className="text-white fw-bold good-times-font fs-4">
              Sign In
            </Typography>

            {/* Email input */}
            <Box className="w-100 d-flex flex-column align-items-start gap-2">
              <Typography
                className="text-white fontstylelabel"
                style={{ fontWeight: 400 }}
              >
                Email
              </Typography>
              <input
                type="email"
                className="p-3 rounded-2 auth_input"
                placeholder="name.surname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <Alert severity="error" sx={{ width: "100%" }}>
                  {emailError}
                </Alert>
              )}
            </Box>

            {/* Password input */}
            <Box className="w-100 position-relative">
              <Box className="w-100 d-flex flex-column align-items-start gap-2">
                <Typography
                  className="text-white fontstylelabel "
                  style={{ fontWeight: 400 }}
                >
                  Password
                </Typography>
                <input
                  type={passwordtype}
                  className="p-3 rounded-2 auth_input"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              {passwordtype === "password" ? (
                <IoEyeSharp
                  size={24}
                  className="position-absolute translate-middle text_gray"
                  id="togglePassword"
                  onClick={() => setpasswordtype("text")}
                  style={{
                    top: "70%",
                    right: "10px",
                    cursor: "pointer",
                    color: "white",
                  }}
                />
              ) : (
                <IoMdEyeOff
                  id="togglePassword"
                  size={24}
                  onClick={() => setpasswordtype("password")}
                  className="position-absolute translate-middle text_gray"
                  style={{
                    top: "70%",
                    right: "10px",
                    cursor: "pointer",
                    color: "white",
                  }}
                />
              )}
            </Box>
            {passwordError && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {passwordError}
              </Alert>
            )}

            <Box className="d-flex flex-row align-items-center justify-content-end w-100">
              <Typography
                onClick={() => navigate("/forget-email")}
                className="text_blue"
                sx={{ fontSize: "12px", cursor: "pointer" }}
              >
                Forget Password
              </Typography>
            </Box>
            <Button
              type="submit"
              onClick={handleSignIn}
              className="w-100 rounded-2 py-2"
              sx={{
                textTransform: "none",
                color: "black",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "#f8f8f8",
                },
              }}
            >
              Sign In
            </Button>
            <Typography
              className="text-white"
              sx={{ fontSize: "12px", textAlign: "center" }}
            >
              Don't have an account?{" "}
              <Typography
                onClick={() => navigate("/sign-up")}
                component={"span"}
                className="text_blue"
                sx={{ fontSize: "12px", cursor: "pointer" }}
              >
                Sign up
              </Typography>
            </Typography>
          </form>
        </Box>
      </Box>
      <Box sx={{ height: "auto" }} className="w-100 d-md-block d-none p-0">
        <img
          src="/signUpDoctor.svg"
          alt="Doctor"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Loader loading={loading} />
    </Box>
  );
};

export default SignIn;
