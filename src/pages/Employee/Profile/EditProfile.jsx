import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import VerificationSection from "./VerificationSection";
import App from "../../../components/Autogoogle/Autogooglecomplete";
import apiClient from "../../../api/apiClient";
import FileUploadField from "../../../components/fileupload/FileUploadField";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { Loader } from "../../../components/Loader/loader";
import { Alert } from "@mui/material";
const EditProfile = ({ userprofile, setIsEditing, setUserprofile }) => {
  const [isHovereds, setIsHovereds] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    address: null,
    dob: "",
    role: "",
    personalpic: "",
    phone: "",
    name: "",
  });

  const [role, setRole] = useState();
  const [errors, setErrors] = useState({});

  const getUserdata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        "/professional/api/professional/my_profile/"
      );
      console.log(response, "this is roledata response");
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

  const getRole = async () => {
    try {
      const response = await apiClient.get("/api/role/?page_size=30");
      console.log(response, "this is roledata response");
      if (response.ok) {
        setRole(response?.data?.results);
      }
    } catch (error) {
      console.log(error, "this is error of response");
    }
  };
  const isValidDOB = (dob) => {
    const today = new Date();
    const dobDate = new Date(dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    const isBirthdayPassed =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());
    const adjustedAge = isBirthdayPassed ? age : age - 1;
    return adjustedAge >= 18;
  };

  const handleSubmit = async () => {
    const newErrors = {};
    console.log(formData?.address, "this is picture data");
    const excludeFields = ["other", "otherpic"];
    Object.keys(formData).forEach((field) => {
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
      if (isValidDOB(formData?.dob)) {
        mainform.append("dob", formData?.dob);
      } else {
        toast.success("You must be at least 18 years old.");
        return null;
      }
      mainform.append("role", formData?.role);
      mainform.append("name", formData?.name);
      mainform.append("phone", formData?.phone);
      mainform.append("address", formData?.address?.address);
      mainform.append("latitude", formData?.address?.latitude);
      mainform.append("longitude", formData?.address?.longitude);
      mainform.append("gender", formData?.gender);
      if (formData?.personalpic instanceof File) {
        mainform.append("dp", formData?.personalpic);
      }
      console.log("mainform how this is possible", formData);
      try {
        // setAuthToken();
        setLoading(true);
        const response = await apiClient.patch(
          "/professional/api/professional/update_profile/",
          mainform
        );
        console.log(response, "this is response data");
        if (response.ok) {
          setLoading(false);
          getUserdata();
          setIsEditing(false);
          console.log("profile create successfully:", response.data);
          toast.success("Profile updated  successfully");
        } else {
          setLoading(false);
          if (response.status === 400) {
            Object.entries(response.data).forEach(([key, value]) => {
              toast.error(value);
            });
          } else {
            toast.error("Failed to create profile");
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Network error:", error);
      }
    } else {
      Object.keys(newErrors).map((item) => {
        if (
          item === "coverpic" ||
          item === "professionalpic" ||
          item === "driverpic" ||
          item === "personalpic" ||
          item === "certificatepic"
        ) {
          if (item === "coverpic") {
            toast.error(`Resume pdf is required`);
          } else if (item === "professionalpic") {
            toast.error(`Professional License  picture is required`);
          } else if (item === "certificatepic") {
            toast.error(`Certificate picture is required`);
          } else if (item === "driverpic") {
            toast.error(`Driver’s License picture is required`);
          } else {
            toast.error(`Profile picture is required`);
          }
        }
      });
    }
  };

  useEffect(() => {
    getRole();
  }, []);
  useEffect(() => {
    if (userprofile) {
      setFormData({
        addressname: userprofile?.address?.address,
        address: userprofile?.address,
        dob: userprofile?.dob,
        personalpic: userprofile?.dp,
        role: userprofile?.role.id,
        phone: userprofile?.phone,
        name: userprofile?.name,
        gender:
          userprofile?.gender === "Male"
            ? "M"
            : userprofile?.gender === "Female"
            ? "F"
            : "O",
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
  console.log(formData?.gender, "this is gender data");
  return (
    <Container fluid className=" mt-4">
      <div className="w-100 h-100">
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
            <Form>
              <Form.Group controlId="formName" className="mb-4">
                <Form.Label
                  style={{
                    color: "#7b7b7b",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                >
                  Name <span style={{ color: "red" }}>*</span>{" "}
                </Form.Label>
                <Form.Control
                  value={formData?.name}
                  name={"name"}
                  type="text"
                  className="form-control-lg"
                  onChange={handleChange}
                  style={{ backgroundColor: "#ffffff" }}
                />
                {errors.name && (
                  <Alert severity="error" className="mt-2">
                    Namw is required
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="formGender" className="mb-4">
                <Form.Label>Gender</Form.Label>
                <select
                  name="gender"
                  className="form-select"
                  value={formData?.gender}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    // border: "none",
                    height: "45px",
                    // outline: "none",
                  }}
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {errors.gender && (
                  <Alert severity="error" className="mt-2">
                    Gender is required
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="formDOB" className="mb-4">
                <Form.Label>Date of Birth</Form.Label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    // border: "none",
                    height: "45px",
                    outline: "none",
                  }}
                />
                {errors.dob && (
                  <Alert severity="error" className="mt-2">
                    Date of Birth is required
                  </Alert>
                )}
              </Form.Group>
            </Form>
          </div>

          <div className="col-12 col-md-4">
            <Form>
              <Form.Group controlId="formAddress" className="mb-4">
                <Form.Label
                  style={{
                    color: "#7b7b7b",
                    fontSize: "18px",
                    fontWeight: 500,
                  }}
                >
                  Address
                </Form.Label>
                <App
                  nodeData={formData.address}
                  lable={formData?.addressname}
                  setNodeData={(data) => {
                    setFormData((prev) => ({ ...prev, ["address"]: data }));
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formRole" className="mb-4">
                <Form.Label>Employee preference</Form.Label>
                <select
                  name="role"
                  className="form-select"
                  value={formData?.role}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "none",
                    height: "45px",
                    outline: "none",
                  }}
                >
                  <option value="">Select</option>

                  {role?.map((item, index) => {
                    return (
                      <option key={index} value={item?.id}>
                        {item?.name}
                      </option>
                    );
                  })}
                </select>
                {errors.role && (
                  <Alert severity="error" className="mt-2">
                    Role is required
                  </Alert>
                )}
              </Form.Group>
              <Form.Group controlId="formPhone" className="mb-4">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                  className="form-control-lg"
                  style={{ backgroundColor: "#ffffff" }}
                />
                {errors.phone && (
                  <Alert severity="error" className="mt-2">
                    phone is required
                  </Alert>
                )}
              </Form.Group>
            </Form>
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
