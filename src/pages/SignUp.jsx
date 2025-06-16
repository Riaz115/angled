import { Box, Typography, Checkbox, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input"; // Adjusted import here
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import apiClient from "../api/apiClient";
import { Loader } from "../components/Loader/loader";
import { toast } from "react-toastify";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const SignUp = () => {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordType((prevType) =>
      prevType === "password" ? "text" : "password"
    );
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required.";
    if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber))
      newErrors.phoneNumber =
        "Valid phone number with country code is required.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms of service.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form Data:", {
        ...formData,
        phone: phoneNumber,
      });
      try {
        setLoading(true);
        const response = await apiClient.post("/api/users/", {
          ...formData,
          phone: phoneNumber,
        });
        console.log(response, "this is response data");
        if (response.ok) {
          setLoading(false);
          navigate(`/otpset/${response.data.id}`);
          localStorage.setItem("userid", response?.data?.id);
          console.log("User registered successfully:", response.data);
        } else {
          setLoading(false);

          if (response.status === 400) {
            toast.error("User already exist");
          } else {
            if (response?.data?.password) {
              response.data?.password?.forEach((element) => {
                toast.error(element);
              });
            }
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box className="d-flex flex-row w-100" style={{ height: "100vh" }}>
      {/* Left Signup Form Section */}
      <Box
        className="w-100 p-5 bg_primary leftSignup"
        sx={{
          backgroundImage: "url('/signatureBG.svg')",
          backgroundPosition: "center bottom 50px",
          backgroundRepeat: "no-repeat",
          overflow: "auto",
        }}
      >
        <Box className="d-flex flex-row justify-content-center w-100">
          <Box sx={{ width: { xs: "100%", md: "80%", lg: "70%" } }}>
            <form
              className="d-flex flex-column justify-content-center align-items-center mt-3 gap-3 w-100"
              onSubmit={handleSignUp}
            >
              {/* Logo */}
              <Box
                className="d-flex flex-row justify-content-center mt-3"
                sx={{ width: { xs: "300px", md: "400px" } }}
              >
                <img src="/signUpLogo.svg" alt="Logo" className="img-fluid" />
              </Box>

              {/* Title */}
              <Typography className="text-white fw-bold good-times-font my-3 fs-4">
                Sign Up
              </Typography>

              {/* Name Field */}
              <Box className="w-100 d-flex flex-column align-items-start gap-2">
                <Typography className="text-white fontstylelabel">
                  Name
                </Typography>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 rounded-2 auth_input"
                  placeholder="Enter Your Name"
                />
                {errors.name && (
                  <Alert severity="error" className="w-100">
                    {errors.name}
                  </Alert>
                )}
              </Box>

              {/* Email Field */}
              <Box className="w-100 d-flex flex-column align-items-start gap-2">
                <Typography className="text-white fontstylelabel">
                  Email
                </Typography>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 rounded-2 auth_input"
                  placeholder="name.surname@gmail.com"
                />
                {errors.email && (
                  <Alert severity="error" className="w-100">
                    {errors.email}
                  </Alert>
                )}
              </Box>

              {/* Phone Number Field */}
              <Box className="w-100 d-flex flex-column align-items-start gap-2">
                <Typography className="text-white fontstylelabel">
                  Phone Number
                </Typography>
                <PhoneInput
                  international
                  defaultCountry="PK"
                  className="p-3 rounded-2 auth_input"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                />
                {errors.phoneNumber && (
                  <Alert severity="error" className="w-100">
                    {errors.phoneNumber}
                  </Alert>
                )}
              </Box>

              {/* Password Field */}
              <Box className="w-100 position-relative">
                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                  <Typography className="text-white fontstylelabel">
                    Password
                  </Typography>
                  <input
                    type={passwordType}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="p-3 rounded-2 auth_input"
                    placeholder="Enter Password"
                  />
                  {passwordType === "password" ? (
                    <IoEyeSharp
                      size={24}
                      className="position-absolute translate-middle text_gray"
                      style={{
                        top: "70%",
                        right: "10px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <IoMdEyeOff
                      size={24}
                      className="position-absolute translate-middle text_gray"
                      style={{
                        top: "70%",
                        right: "10px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </Box>
              </Box>
              {errors.password && (
                <Alert severity="error" className="w-100">
                  {errors.password}
                </Alert>
              )}

              {/* Confirm Password Field */}
              <Box className="w-100 position-relative">
                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                  <Typography className="text-white fontstylelabel">
                    Confirm Password
                  </Typography>
                  <input
                    type={confirmPasswordType}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="p-3 rounded-2 auth_input"
                    placeholder="Re-enter Password"
                  />
                  {confirmPasswordType === "password" ? (
                    <IoEyeSharp
                      className="position-absolute translate-middle text_gray"
                      size={24}
                      style={{
                        top: "70%",
                        right: "10px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  ) : (
                    <IoMdEyeOff
                      size={24}
                      className="position-absolute translate-middle text_gray"
                      style={{
                        top: "70%",
                        right: "10px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={toggleConfirmPasswordVisibility}
                    />
                  )}
                </Box>
              </Box>
              {errors.confirmPassword && (
                <Alert severity="error" className="w-100">
                  {errors.confirmPassword}
                </Alert>
              )}

              {/* Terms Checkbox */}
              <Box className="d-flex flex-row align-items-center w-100 me-4">
                <Checkbox
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      termsAccepted: e.target.checked,
                    }))
                  }
                  sx={{ color: "#004fff" }}
                />
                <Typography
                  className="text-white text-nowrap"
                  sx={{ fontSize: "12px" }}
                >
                  I agree with the{" "}
                  <Typography
                    component={"span"}
                    className="text_blue"
                    sx={{ fontSize: "12px", cursor: "pointer" }}
                  >
                    Terms of Service
                  </Typography>
                </Typography>
              </Box>
              {errors.termsAccepted && (
                <Alert severity="error" className="w-100">
                  {errors.termsAccepted}
                </Alert>
              )}
              <Button
                type="submit"
                className="w-100 rounded-2 py-2 fw-bold text-capitalize"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Sign Up
              </Button>

              <Typography
                className="text-white text-nowrap"
                sx={{ fontSize: "12px" }}
              >
                Already have an account ?{" "}
                <Typography
                  onClick={() => navigate("/")}
                  component={"span"}
                  className="text_blue"
                  sx={{ fontSize: "12px", cursor: "pointer" }}
                >
                  Sign in
                </Typography>
              </Typography>
            </form>
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: "100vh" }} className="w-100 d-md-block d-none p-0">
        <img
          src="/signUpDoctor.svg"
          alt=""
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
          }}
        />
      </Box>
      <Loader loading={loading} />
    </Box>
  );
};

export default SignUp;
