import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { Loader } from "../../../components/Loader/loader";
import { Alert } from "@mui/material";
import VerificationSection from "../../Employee/Profile/VerificationSection";
import FileUploadField from "../../../components/fileupload/FileUploadField";
import apiClient from "../../../api/apiClient";
import { useNavigate } from "react-router-dom";

const profileTypeMap = {
  Public: "P",
  Private: "PR",
  Other: "O",
};

const EditProfile = ({ userprofile, setIsEditing, getProfile }) => {
  const navigate = useNavigate();
  const [isHovereds, setIsHovereds] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profiletype: "",
    website: "",
    foundeddate: "",
    role: "",
    personalpic: "",
    email: "",
  });

  const [role, setRole] = useState();
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    const newErrors = {};
    const excludeFields = ["email"];

    Object.keys(formData).forEach((field) => {
      // Check if the field is empty and not in the excluded list
      if (!formData[field] && !excludeFields.includes(field)) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
      }
    });

    setErrors(newErrors);
    console.log(newErrors, "these are errors");

    if (Object.keys(newErrors).length === 0) {
      const mainform = new FormData();

      // Append other necessary fields to FormData
      mainform.append("speciality", formData?.role);
      mainform.append("name", formData?.name);
      mainform.append("website", formData?.website);
      mainform.append("email", formData?.email);
      mainform.append("phone", formData?.phone);
      mainform.append("type", formData?.profiletype);
      mainform.append("founded_date", formData?.foundeddate);

      // Append personal pic if it's a File (image)
      if (formData?.personalpic instanceof File) {
        mainform.append("dp", formData?.personalpic);
      }

      console.log("mainform how this is possible", formData);

      try {
        // Send the form data to the backend for updating the profile
        setLoading(true);
        const response = await apiClient.patch(
          `/facility/api/profile/${userprofile.id}/`,
          mainform
        );
        console.log(response, "this is response data");

        if (response.ok) {
          setLoading(false);
          setIsEditing(false);
          getProfile();
          console.log("profile updated successfully:", response.data);
          toast.success("Profile updated successfully");
          navigate("/employer/settings");
        } else {
          setLoading(false);
          if (response.status === 400) {
            Object.entries(response.data).forEach(([key, value]) => {
              toast.error(value);
            });
          } else {
            toast.error("Failed to update profile");
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    } else {
      // Handle validation errors for required fields
      Object.keys(newErrors).forEach((item) => {
        toast.error(`${newErrors[item]}`);
      });
    }
  };

  useEffect(() => {
    if (userprofile) {
      setFormData({
        name: userprofile?.user?.name,
        phone: userprofile?.user?.phone,
        profiletype: profileTypeMap[userprofile?.type] || "",
        website: userprofile?.website,
        foundeddate: userprofile?.founded_date,
        role: userprofile?.speciality,
        personalpic: userprofile?.dp,
        email: userprofile?.user.email,
      });
    }
  }, [userprofile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemove = (name) => {
    setFormData((prev) => ({ ...prev, [name]: "" }));
  };
  const handleUpload = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  return (
    <Container fluid className=" mt-4 bg-white py-2">
      <div className="w-100 h-full">
        {/* Heading */}
        <div className="row mb-4">
          <div className="col">
            <h4
              className="fw-bold text-primary"
              style={{ fontFamily: "Poppins", fontSize: "20px" }}
            >
              Personal Details
            </h4>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3 d-flex flex-column  mb-3 mb-md-0">
            {
              <VerificationSection
                width="280px"
                height="270px"
                file={formData?.personalpic}
              />
            }
            <div className="row justify-content-evenly mt-3">
              <div className="col">
                {" "}
                <div
                  onClick={() => handleRemove("personalpic")}
                  className="d-flex align-items-center gap-2 text-dark cursor-pointer mt-3"
                >
                  <FaTrash size={18} />
                  <span
                    className="fw-normal"
                    style={{ fontFamily: "Poppins", fontSize: "18px" }}
                  >
                    Remove
                  </span>
                </div>
              </div>
              <div className="col">
                <Form.Group controlId="formFile" className="mb-0">
                  <Form.Control type="file" className="d-none" />
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*"}
                    name="personalpic"
                    onFileSelect={handleUpload}
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <Form.Group controlId="formName" className="mb-4">
              <Form.Label
                style={{
                  color: "#7b7b7b",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                value={formData.name}
                name="name"
                type="text"
                onChange={handleChange}
                style={{ backgroundColor: "#ffffff" }}
              />
              {errors.name && (
                <Alert variant="danger" className="mt-2">
                  {errors.name}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="formGender" className="mb-4">
              <Form.Label>Profile Type</Form.Label>
              <select
                name="profiletype"
                className="form-select"
                value={formData.profiletype}
                onChange={handleChange}
                style={{
                  backgroundColor: "#ffffff",
                  height: "38px",
                }}
              >
                <option value="">Select</option>
                <option value="P">Public</option>
                <option value="PR">Private</option>
                <option value="O">Other</option>
              </select>
              {errors.profiletype && (
                <Alert variant="danger" className="mt-2">
                  {errors.profiletype}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="foundeddate" className="mb-4">
              <Form.Label
                style={{
                  color: "#7b7b7b",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                Founded Date <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                value={formData.foundeddate}
                name="foundeddate"
                type="date"
                onChange={handleChange}
                style={{ backgroundColor: "#ffffff" }}
              />
              {errors.foundeddate && (
                <Alert variant="danger" className="mt-2">
                  {errors.foundeddate}
                </Alert>
              )}
            </Form.Group>
          </div>

          <div className="col-12 col-md-4">
            <Form.Group controlId="formWebsite" className="mb-4">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                value={formData.website}
                name="website"
                onChange={handleChange}
                placeholder="Enter website address"
              />
            </Form.Group>

            <Form.Group controlId="formSpeciality" className="mb-4">
              <Form.Label>Speciality</Form.Label>
              <Form.Control
                type="text"
                value={formData.role}
                name="role"
                onChange={handleChange}
                placeholder="Enter speciality"
              />
              {errors.speciality && (
                <Alert variant="danger" className="mt-2">
                  {errors.speciality}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="formPhone" className="mb-4">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                name="phone"
                onChange={handleChange}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <Alert variant="danger" className="mt-2">
                  {errors.phone}
                </Alert>
              )}
            </Form.Group>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row d-flex justify-content-end me-5 mt-5 mb-3">
          <div className="col-12 d-flex col-md-4 justify-content-between me-5 gap-2">
            <div>
              <Button
                variant="primary"
                style={{
                  width: "155px",
                  height: "45px",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#004fff",
                  backgroundColor: "#f7f7f7",
                  border: "2px solid #004fff",
                }}
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="">
              <Button
                variant="primary"
                style={{
                  width: "155px",
                  height: "45px",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#004FFF",
                  border: isHovereds ? "2px solid #004FFF" : "none",
                  backgroundColor: "#004FFF1A",
                }}
                onMouseEnter={() => setIsHovereds(true)}
                onMouseLeave={() => setIsHovereds(false)}
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Loader loading={loading} />
    </Container>
  );
};

export default EditProfile;
