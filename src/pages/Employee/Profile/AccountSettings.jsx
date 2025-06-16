import React, { useEffect, useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { RxCrossCircled } from "react-icons/rx";
import { Alert } from "@mui/material";
import apiClient from "../../../api/apiClient";
import { Loader } from "../../../components/Loader/loader";
import { encryptUserData } from "../../../api/reuse";
import { encryptKey } from "../../../config";
import { selectUser } from "../../../redux/userSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [profilePrivacy, setProfilePrivacy] = useState(true);
  const [resumePrivacy, setResumePrivacy] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [loading, setloading] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState({});
  const user = useSelector(selectUser);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const getProfilePrivacy = async () => {
    try {
      setloading(true);
      const response = await apiClient.get(
        `/professional/api/profile_privacy/`
      );
      if (response.ok) {
        const data = response.data[0];
        setPrivacy(data);
        setProfilePrivacy(data.profile_privacy);
        setResumePrivacy(data.resume_privacy);
      }
    } catch (error) {
      console.error("Error fetching privacy settings:", error);
    } finally {
      setloading(false);
    }
  };

  const updateProfilePrivacy = async (value) => {
    try {
      setloading(true);
      const response = await apiClient.patch(
        `/professional/api/profile_privacy/${privacy.id}/`,
        {
          profile_privacy: value,
        }
      );
      if (response.ok) {
        console.log("Profile privacy updated successfully");
        toast.success("Profile privacy updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile privacy:", error);
    } finally {
      setloading(false);
    }
  };

  const updateResumePrivacy = async (value) => {
    try {
      setloading(true);
      const response = await apiClient.patch(
        `/professional/api/profile_privacy/${privacy.id}/`,
        {
          resume_privacy: value,
        }
      );
      if (response.ok) {
        console.log("Resume privacy updated successfully");
        toast.success("Resume privacy updated successfully");
      }
    } catch (error) {
      console.error("Error updating resume privacy:", error);
    } finally {
      setloading(false);
    }
  };

  const handleProfilePrivacyChange = () => {
    const newValue = !profilePrivacy;
    setProfilePrivacy(newValue);
    updateProfilePrivacy(newValue);
  };

  const handleResumePrivacyChange = () => {
    const newValue = !resumePrivacy;
    setResumePrivacy(newValue);
    updateResumePrivacy(newValue);
  };

  useEffect(() => {
    if (user) {
      getProfilePrivacy();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    let validationErrors = {};
    if (!formData.currentPassword) {
      validationErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword) {
      validationErrors.newPassword = "New password is required";
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSaveChanges = async () => {
    if (validateForm()) {
      const dataToSave = {
        profilePrivacy,
        resumePrivacy,
        ...formData,
      };

      try {
        setloading(true);
        const response = await apiClient.patch("/api/users/reset_password/", {
          old_password: formData.currentPassword,
          new_password: formData.confirmPassword,
        });
        console.log(response, "this is roledata response");
        if (response.ok) {
          const admin = encryptUserData(
            { access: response?.data?.access, ...user },
            encryptKey
          );
          localStorage.setItem("USER_STRING", JSON.stringify(admin));
          toast.success("Password Update Successfully");
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          console.log(response.data.access);
        } else {
          console.log(response.data.new_password);
          if (response.data.detail) {
            toast.error(response.data.detail);
          } else {
            response?.data?.new_password?.forEach((element) => {
              toast.error(element);
            });
          }
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error, "this is error of response");
      }
      console.log("Form Data Saved:", dataToSave);
    }
  };

  return (
    <div className="container mt-4 w-75">
      {/* Profile Privacy */}
      <Row className="mt-5">
        {/* Profile Privacy */}
        <Col md={6} className="mb-3">
          <label className="d-block mb-2 fontstylelabel fw-bold">
            Profile Privacy
          </label>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "3px",
              borderRadius: "5px",
            }}
          >
            <Row className="align-items-center">
              <Col xs="auto">
                <Form.Check
                  type="switch"
                  style={{
                    color: profilePrivacy ? "#004fff" : "#e05151",
                    fontSize: "18px",
                  }}
                  id="profilePrivacy"
                  className="ms-2"
                  label={profilePrivacy ? "Yes" : "No"}
                  checked={profilePrivacy}
                  onChange={handleProfilePrivacyChange}
                  disabled={loading}
                />
              </Col>
              <Col xs="auto" className="px-3">
                <div
                  style={{
                    width: "1px",
                    height: "30px",
                    backgroundColor: "#d3d3d3",
                  }}
                />
              </Col>
              <Col>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder={
                    profilePrivacy
                      ? "Your profile is public now"
                      : "Your profile is private now"
                  }
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root fieldset": {
                      border: "none",
                    },
                  }}
                  disabled
                />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Resume Privacy */}
        <Col md={6} className="mb-3">
          <label className="d-block mb-2 fontstylelabel fw-bold">
            Resume Privacy
          </label>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "3px",
              borderRadius: "5px",
            }}
          >
            <Row className="align-items-center">
              <Col xs="auto">
                <Form.Check
                  type="switch"
                  id="resumePrivacy"
                  className="ms-2"
                  style={{
                    color: resumePrivacy ? "#004fff" : "#e05151",
                    fontSize: "18px",
                  }}
                  label={resumePrivacy ? "Yes" : "No"}
                  checked={resumePrivacy}
                  onChange={handleResumePrivacyChange}
                  disabled={loading}
                />
              </Col>
              <Col xs="auto" className="px-3">
                <div
                  style={{
                    width: "1px",
                    height: "30px",
                    backgroundColor: "#d3d3d3",
                  }}
                />
              </Col>
              <Col>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  placeholder={
                    resumePrivacy
                      ? "Your resume is public now"
                      : "Your resume is private now"
                  }
                  sx={{
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-root fieldset": {
                      border: "none",
                    },
                  }}
                  disabled
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <hr
        className="mb-3"
        style={{ border: "1px solid #d3d3d3", margin: "20px 0" }}
      />

      {/* Change Password */}
      <p className="fontstylelabel fw-bold mb-3" style={{ marginTop: "5%" }}>
        Change Password
      </p>
      <Row>
        {["Current Password", "New Password", "Confirm Password"].map(
          (label, index) => {
            const fieldName =
              label === "Current Password"
                ? "currentPassword"
                : label === "New Password"
                ? "newPassword"
                : "confirmPassword";

            return (
              <Col md={4} key={index} className="mb-3">
                <div className="d-flex flex-column">
                  <label className="fontstylelabel mb-2">{label}</label>
                  <TextField
                    size="small"
                    type={showPassword[fieldName] ? "text" : "password"}
                    className="fontstyleText"
                    variant="outlined"
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    sx={{
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                [fieldName]: !prev[fieldName],
                              }))
                            }
                            edge="end"
                          >
                            {showPassword[fieldName] ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {errors[fieldName] && (
                    <Alert severity="error" sx={{ width: "100%", mt: 1 }}>
                      {errors[fieldName]}
                    </Alert>
                  )}
                </div>
              </Col>
            );
          }
        )}
      </Row>

      <hr
        className="mb-3"
        style={{ border: "1px solid #d3d3d3", margin: "20px 0" }}
      />
      <Button
        variant="primary"
        className="mb-4 mt-4"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>

      {/* Delete Account */}
      <h6
        className="mt-3 mb-2 fontstylelabel"
        onClick={() => setShowDeleteAccount(!showDeleteAccount)}
        style={{ cursor: "pointer" }}
      >
        Delete Your Account
      </h6>
      {showDeleteAccount && (
        <div className="col-6">
          <p className="text-muted">
            If you delete your Jobpilot account, you will no longer be able to
            get information about matched jobs, following employers, job alerts,
            and more. You will be removed from all services of Jobpilot.com.
          </p>
          <div className="d-flex align-items-center mt-3">
            <RxCrossCircled size={24} color="#c90101" />
            <span className="text-danger fw-bold ms-2">Close Account</span>
          </div>
        </div>
      )}
      <Loader loading={loading} />
    </div>
  );
};

export default AccountSettings;
