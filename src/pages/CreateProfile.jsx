import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import logoimage from "../assets/fonts/Picsart_24-10-02_16-28-04-574 1.png";
import { Link, useNavigate } from "react-router-dom";
import App from "../components/Autogoogle/Autogooglecomplete";
import apiClient from "../api/apiClient";
import { Loader } from "../components/Loader/loader";
import { toast } from "react-toastify";
import { encryptKey } from "../config";
import { decryptUserData, encryptUserData } from "../api/reuse";
import FileUploadField from "../components/fileupload/FileUploadField";
import Resume from "../components/editdoc/Resume";
import Certifications from "../components/editdoc/Certifications";
import Driver from "../components/editdoc/Driver";
import Professional from "../components/editdoc/Professional";
import Other from "../components/editdoc/Other";
import PdfThumbnails from "../components/PdfThumbnails";
const CreateProfile = () => {
  const [formData, setFormData] = useState({
    gender: "",
    address: null,
    dob: "",
    role: "",
    cnic: "",
    personalpic: "",
    licenseNumber: "",
    licenseExpiry: "",
    driverpic: "",
    companyname: "",
    plicenseNumber: "",
    professionalExpiry: "",
    professionalpic: "",
    certificate: "",
    certificatepic: "",
    coverletter: "",
    coverpic: "",
    other: "",
    otherpic: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();
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
  useEffect(() => {
    getRole();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpload = (name, file) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };
  const handleRemove = (name) => {
    setFormData((prev) => ({ ...prev, [name]: "" }));
  };
  const isValidDOB = (dob) => {
    const today = new Date();
    const dobDate = new Date(dob);

    // Calculate the difference in years
    const age = today.getFullYear() - dobDate.getFullYear();

    // Check if the user's birthday has occurred this year
    const isBirthdayPassed =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());

    // Adjust the age if the birthday hasn't occurred yet this year
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
      mainform.append("dp", formData?.personalpic);
      if (isValidDOB(formData?.dob)) {
        mainform.append("dob", formData?.dob);
      } else {
        toast.success("You must be at least 18 years old.");
        return null;
      }
      mainform.append("role", formData?.role);
      mainform.append("address", formData?.address?.address);
      mainform.append("state", formData?.address?.state || "null");
      mainform.append("city", formData?.address?.city || "null");
      mainform.append("country", formData?.address?.country || "null");
      mainform.append("latitude", formData?.address?.latitude);
      mainform.append("longitude", formData?.address?.longitude);
      mainform.append("gender", formData?.gender);
      mainform.append("cnic", formData?.cnic);
      mainform.append("number", formData?.licenseNumber);
      mainform.append("expiry_date", formData?.licenseExpiry);
      mainform.append("driver_file", formData?.driverpic);
      mainform.append("company", formData?.companyname);
      mainform.append("number", formData?.plicenseNumber);
      mainform.append("expiry_date", formData?.professionalExpiry);
      mainform.append("professional_file", formData?.personalpic);
      mainform.append("type", formData?.certificate);
      mainform.append("certificate_file", formData?.certificatepic);
      mainform.append("resume_file", formData?.coverpic);
      mainform.append("cover_letter", formData?.coverletter);
      mainform.append("other_file", formData?.otherpic);
      mainform.append("detail", formData?.other);

      // console.log(JSON.stringify(mainform,null,2),formData,"this is form data");
      //  return null;
      try {
        // setAuthToken();
        setLoading(true);
        const response = await apiClient.post(
          "/professional/api/professional/",
          mainform
        );
        console.log(response, "this is response data");
        if (response.ok) {
          setLoading(false);
          const storedData = localStorage.getItem("USER_STRING");
          const data = JSON.parse(storedData);
          const adminData = decryptUserData(data, encryptKey);
          const updatedata = { ...adminData, profile_completed: true };
          const admin = encryptUserData(updatedata, encryptKey);
          localStorage.setItem("USER_STRING", JSON.stringify(admin));
          console.log("profile create successfully:", response.data);
          navigate(`/profile`);
          toast.success("File create successfully");
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-md-5 p-3" style={{ backgroundColor: "#f5f5f5" }}>
      <Box className="d-flex flex-row align-items-center">
        <img width={"70px"} src={logoimage} alt="Logo" />
        <Typography className="good-times-font fs-4 fw-bold text-center w-100">
          Fill Details <br />& Upload Credentials
        </Typography>
      </Box>
      {/* //////////////////////// Personal Details //////////////////////////// */}
      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Personal Details
        </Typography>
        <Box className="row">
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center justify-content-center ">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.personalpic ? (
                  <img
                    src={
                      formData?.personalpic
                        ? URL.createObjectURL(formData?.personalpic)
                        : "/gallery.png"
                    }
                    alt="Verification"
                    className="img-fluid mb-3"
                    style={{
                      width: "300px", // Set a fixed width
                      height: "300px", // Set a fixed height
                      objectFit: "cover", // Ensures image covers the container without distorting its aspect ratio
                      borderRadius: "40px",
                    }}
                  />
                ) : (
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: "0.3",
                    }}
                  >
                    <img
                      src={"/gallery.png"}
                      alt="Verification"
                      className="img-fluid mb-3 mt-3"
                      style={{
                        width: "50%", // Can be adjusted for the placeholder size
                        height: "auto", // Maintain aspect ratio for placeholder image
                      }}
                    />
                  </div>
                )}

                {formData?.personalpic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Personal Details
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Photo
                  </Button>
                )}
              </Box>

              <Box className="d-flex justify-content-between align-items-center me-2 ms-2">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                    },
                  }}
                  onClick={() => handleRemove("personalpic")}
                  startIcon={<DeleteIcon />}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*"}
                    name="personalpic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="col-lg-9 col-md-7">
            <Box className="row">
              <Box className="col-lg-6 mt-3">
                <label style={{ color: "#909090", fontWeight: 600 }}>
                  Gender
                </label>
                <select
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "none",
                    height: "45px",
                    outline: "none",
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
              </Box>
              <Box className="col-lg-6 mt-3">
                <label style={{ color: "#909090", fontWeight: 600 }}>
                  Address
                </label>
                <App
                  nodeData={formData.address}
                  setNodeData={(data) => {
                    setFormData((prev) => ({ ...prev, ["address"]: data }));
                  }}
                />
                {errors.address && (
                  <Alert severity="error" className="mt-2">
                    Address is required
                  </Alert>
                )}
              </Box>
              <Box className="col-lg-6 mt-3">
                <label style={{ color: "#909090", fontWeight: 600 }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "none",
                    height: "45px",
                    outline: "none",
                  }}
                  max={new Date().toISOString().split("T")[0]}
                />

                {errors.dob && (
                  <Alert severity="error" className="mt-2"></Alert>
                )}
              </Box>
              <Box className="col-lg-6 ">
                <label
                  className="mt-3"
                  style={{ color: "#909090", fontWeight: 600 }}
                >
                  Role
                </label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
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
                    Employee preference is required
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* /////////////////////// Driver’s License//////////////////////// */}
      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Driver’s License
        </Typography>

        <Box className="row">
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.driverpic ? (
                  <img
                    src={
                      formData?.driverpic
                        ? URL.createObjectURL(formData?.driverpic)
                        : "/gallery.png"
                    }
                    alt="Verification"
                    className="img-fluid mb-3"
                    style={{
                      width: "300px", // Set a fixed width
                      height: "300px", // Set a fixed height
                      objectFit: "cover", // Ensures image covers the container without distorting its aspect ratio
                      borderRadius: "40px",
                    }}
                  />
                ) : (
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: "0.3",
                    }}
                  >
                    <img
                      src={"/gallery.png"}
                      alt="Verification"
                      className="img-fluid mb-3 mt-3"
                      style={{
                        width: "50%", // Can be adjusted for the placeholder size
                        height: "auto", // Maintain aspect ratio for placeholder image
                      }}
                    />
                  </div>
                )}

                {formData?.driverpic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Driver’s License
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Photo
                  </Button>
                )}
              </Box>
              <Box className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove("driverpic")}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*"}
                    name="driverpic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Driver
            errors={errors}
            handleChange={handleChange}
            formData={formData}
          />
        </Box>
      </Box>

      {/* ////////////////////////  Professional License////////////////////// */}

      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Professional License
        </Typography>

        <Box className="row">
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.professionalpic ? (
                  <img
                    src={
                      formData?.professionalpic
                        ? URL.createObjectURL(formData?.professionalpic)
                        : "/gallery.png"
                    }
                    alt="Verification"
                    className="img-fluid mb-3"
                    style={{
                      width: "300px", // Set a fixed width
                      height: "300px", // Set a fixed height
                      objectFit: "cover", // Ensures image covers the container without distorting its aspect ratio
                      borderRadius: "40px",
                    }}
                  />
                ) : (
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: "0.3",
                    }}
                  >
                    <img
                      src={"/gallery.png"}
                      alt="Verification"
                      className="img-fluid mb-3 mt-3"
                      style={{
                        width: "50%", // Can be adjusted for the placeholder size
                        height: "auto", // Maintain aspect ratio for placeholder image
                      }}
                    />
                  </div>
                )}

                {formData?.professionalpic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Professional License
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Photo
                  </Button>
                )}
              </Box>

              <Box className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove("professionalpic")}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*"}
                    name="professionalpic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Professional
            errors={errors}
            handleChange={handleChange}
            formData={formData}
          />
        </Box>
      </Box>

      {/* ////////////////////Certificate////////////////////////// */}
      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Certifications
        </Typography>

        <Box className="row">
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.certificatepic ? (
                  typeof formData?.certificatepic === "string" &&
                  formData?.certificatepic.startsWith("https://") ? (
                    formData?.certificatepic?.includes(".pdf") ? (
                      <PdfThumbnails
                        pdfFile={formData?.certificatepic}
                        pageIndex={0}
                      />
                    ) : (
                      <img
                        src={formData?.certificatepic}
                        alt="Document"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )
                  ) : // Handle local file upload
                  formData?.certificatepic?.type === "application/pdf" ? (
                    <PdfThumbnails
                      pdfFile={URL.createObjectURL(formData?.certificatepic)}
                      pageIndex={0}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(formData?.certificatepic)}
                      alt="Document"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )
                ) : (
                  // Placeholder if no file is uploaded
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: 0.3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/gallery.png"
                      alt="Placeholder"
                      className="img-fluid"
                      style={{
                        width: "50%",
                        height: "auto",
                      }}
                    />
                  </div>
                )}

                {formData?.certificatepic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Certifications
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Document
                  </Button>
                )}
              </Box>

              <Box className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove("certificatepic")}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*,application/pdf"}
                    name="certificatepic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Certifications
            errors={errors}
            handleChange={handleChange}
            formData={formData}
          />
        </Box>
      </Box>

      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Resume
        </Typography>

        <Box className="row">
          {/* Left Side: Image and Buttons */}
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.coverpic ? (
                  typeof formData?.coverpic === "string" &&
                  formData?.coverpic.startsWith("https://") ? (
                    // Handle AWS file URL
                    formData?.coverpic.includes(".pdf") ? (
                      <PdfThumbnails
                        pdfFile={formData?.coverpic}
                        // viewedCards={ viewedCards[ index ] }
                        pageIndex={0}
                      />
                    ) : (
                      <img
                        src={formData?.coverpic}
                        alt="doc"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures full coverage of the div
                          // filter: viewedCards[ index ] ? 'blur(4px)' : 'none',
                          // opacity: viewedCards[ index ] ? 0.9 : 1,
                        }}
                      />
                    )
                  ) : // Handle file uploaded directly from local
                  formData?.coverpic.type === "application/pdf" ? (
                    <PdfThumbnails
                      pdfFile={URL.createObjectURL(formData?.coverpic)}
                      // viewedCards={ viewedCards[ index ] }
                      pageIndex={0}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(formData?.coverpic)}
                      alt="doc"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensures full coverage of the div
                        // filter: viewedCards[ index ] ? 'blur(4px)' : 'none',
                        // opacity: viewedCards[ index ] ? 0.9 : 1,
                      }}
                    />
                  )
                ) : (
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: "0.3",
                    }}
                  >
                    <img
                      src={"/gallery.png"}
                      alt="Verification"
                      className="img-fluid mb-3 mt-3"
                      style={{
                        width: "50%", // Can be adjusted for the placeholder size
                        height: "auto", // Maintain aspect ratio for placeholder image
                      }}
                    />
                  </div>
                )}
                {formData?.coverpic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Resume
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Document
                  </Button>
                )}
              </Box>

              <Box className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove("coverpic")}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*,application/pdf"}
                    name="coverpic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side: Centered Cover Letter Input */}
          <Resume
            errors={errors}
            handleChange={handleChange}
            formData={formData}
          />
        </Box>
      </Box>

      <Box className="container my-5">
        <Typography className="test-start fs-5 mb-1 text-primary">
          Other Documents
        </Typography>

        <Box className="row">
          <Box className="col-lg-3 col-md-5 d-flex flex-column align-items-center">
            <Box className="text-center">
              <Box className="position-relative">
                {formData?.otherpic ? (
                  typeof formData?.otherpic === "string" &&
                  formData?.otherpic.startsWith("https://") ? (
                    // Handle AWS file URL
                    formData?.otherpic.includes(".pdf") ? (
                      <PdfThumbnails
                        pdfFile={formData?.otherpic}
                        // viewedCards={ viewedCards[ index ] }
                        pageIndex={0}
                      />
                    ) : (
                      <img
                        src={formData?.otherpic}
                        alt="doc"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures full coverage of the div
                          // filter: viewedCards[ index ] ? 'blur(4px)' : 'none',
                          // opacity: viewedCards[ index ] ? 0.9 : 1,
                        }}
                      />
                    )
                  ) : // Handle file uploaded directly from local
                  formData?.otherpic?.type === "application/pdf" ? (
                    <PdfThumbnails
                      pdfFile={URL.createObjectURL(formData?.otherpic)}
                      // viewedCards={ viewedCards[ index ] }
                      pageIndex={0}
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(formData?.otherpic)}
                      alt="doc"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensures full coverage of the div
                        // filter: viewedCards[ index ] ? 'blur(4px)' : 'none',
                        // opacity: viewedCards[ index ] ? 0.9 : 1,
                      }}
                    />
                  )
                ) : (
                  <div
                    className="border"
                    style={{
                      borderRadius: "40px",
                      height: "300px",
                      width: "300px",
                      opacity: "0.3",
                    }}
                  >
                    <img
                      src={"/gallery.png"}
                      alt="Verification"
                      className="img-fluid mb-3 mt-3"
                      style={{
                        width: "50%", // Can be adjusted for the placeholder size
                        height: "auto", // Maintain aspect ratio for placeholder image
                      }}
                    />
                  </div>
                )}
                {formData?.otherpic ? (
                  <div
                    style={{
                      backgroundColor: "#FFFFFFCC",
                      width: "90%",
                      height: "50px",
                      position: "absolute",
                      bottom: "40px",
                      left: "15px",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      Other Documents
                    </p>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "12px",
                        fontWeight: "500",
                        lineHeight: "19.5px",
                        color: "black",
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        padding: "8px",
                        border: "1px solid black",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      File
                    </div>
                  </div>
                ) : (
                  <Button
                    sx={{
                      color: "black",
                      backgroundColor: "white",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#f2f2f2",
                      },
                    }}
                    className="py-2 text-nowrap shadow-lg w-75 mb-2 position-absolute bottom-0 translate-middle rounded-4"
                    style={{ left: "50%" }}
                  >
                    Verification Photo
                  </Button>
                )}
              </Box>

              <Box className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "black",
                    backgroundColor: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#f2f2f2",
                    },
                  }}
                  startIcon={<DeleteIcon />}
                  onClick={() => handleRemove("otherpic")}
                >
                  Remove
                </Button>
                <Box className=" mt-3">
                  {" "}
                  <FileUploadField
                    // label="Driver’s License"
                    accept={"image/*,application/pdf"}
                    name="otherpic"
                    onFileSelect={handleUpload}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Other
            handleChange={handleChange}
            formData={formData}
            errors={errors}
          />
        </Box>
      </Box>

      <Box className="d-flex justify-content-center gap-3 my-5">
        <Link to="/">
          <Button className="" sx={{ color: "#FA3131 " }}>
            Back
          </Button>
        </Link>

        <Button className="" onClick={handleSubmit} sx={{ color: "#1A8200" }}>
          Create Profile
        </Button>
      </Box>
    </Box>
  );
};

export default CreateProfile;
