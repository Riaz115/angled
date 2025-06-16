import React from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button, Box, Typography, Alert } from "@mui/material";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadField from "../components/fileupload/FileUploadField";
import "react-phone-number-input/style.css";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { useState } from "react";
import App from "../components/Autogoogle/Autogooglecomplete";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import { Loader } from "../components/Loader/loader";
const NavModal = ({ showModal, handleCloseModal }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const [confirmPasswordType, setConfirmPasswordType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        confirmpassword: "",
        cnic: "",
        number: "",
        expiry_date: "",
        file: "",
        dp: "",
    });

    const [errors, setErrors] = useState({});

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

    const validateForm = () => {
        const newErrors = {};
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address.";
        }

        // Phone number validation
        if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
            newErrors.phoneNumber = "A valid phone number is required.";
        }

        // Address validation
        if (!formData.address) {
            newErrors.address = "Address is required.";
        }

        // Password validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match.";
        }

        if (!formData.cnic.trim()) {
            newErrors.cnic = "CNIC is required.";
        }

        // License Number validation
        if (!formData.number.trim()) {
            newErrors.number = "License Number is required.";
        }

        // Expiry Date validation
        if (!formData.expiry_date) {
            newErrors.expiry_date = "Expiry Date is required.";
        } else if (new Date(formData.expiry_date) < new Date()) {
            newErrors.expiry_date = "Expiry Date cannot be in the past.";
        }

        // File validation
        if (!formData.file) {
            newErrors.file = "File upload is required.";
        }
        if (!formData.file) {
            newErrors.file = "File upload is required.";
        }
        if (!formData.dp) {
            newErrors.dp = "File upload is required.";
            toast.error("Profile pic  is required");
        }
        if (!formData.file) {
            newErrors.dp = "File upload is required.";
            toast.error("License picture  is required");
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleRemove = (name) => {
        setFormData((prev) => ({ ...prev, [name]: "" }));
    };
    const handleUpload = (name, file) => {
        setFormData((prev) => ({ ...prev, [name]: file }));
    };

    const handleSubmit = async () => {
        const formErrors = validateForm();
        console.log(formErrors, "these are error ");
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            setErrors({});
            const mainform = new FormData();
            mainform.append("name", formData?.name);
            mainform.append("email", formData?.email);
            mainform.append("phone", phoneNumber);
            mainform.append("password", formData?.password);
            mainform.append("address", formData?.address?.address);
            mainform.append("latitude", formData?.address?.latitude);
            mainform.append("longitude", formData?.address?.longitude);
            mainform.append("number", formData?.number);
            mainform.append("cnic", formData?.cnic);
            mainform.append("expiry_date", formData?.expiry_date);
            mainform.append("longitude", formData?.address?.longitude);
            mainform.append("file", formData?.file);
            mainform.append("dp", formData?.dp);

            try {
                setLoading(true);
                const response = await apiClient.post(
                    "/api/users/create_facility/",
                    mainform
                );
                console.log(response, "this is response data");
                if (response.ok) {
                    setLoading(false);
                    handleCloseModal();
                    setFormData({
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
                    setPhoneNumber("");
                    toast.success("Invitation send successfully");
                } else {
                    setLoading(false);
                    if (response.status === 400) {
                        Object.entries(response.data).forEach(([key, value]) => {
                            toast.error(value[0]);
                        });
                    } else {
                        toast.error("Failed to send Invite");
                    }
                }
            } catch (error) {
                setLoading(false);
                console.error("Network error:", error);
            }
        }
    };
    return (
        <Modal size="lg" show={showModal} onHide={handleCloseModal}>
            <Modal.Header style={{ backgroundColor: "#f5f5f5" }}>
                <p
                    style={{
                        color: "#000000",
                        fontSize: "18px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                    }}
                >
                    Invite a User
                </p>
            </Modal.Header>
            <Modal.Body>
                <div className="row d-flex jsutify-content-center align-item-center">
                    <Box className="col-md-6 mx-auto mb-1">
                        <Typography className="fs-5 mb-1 text-center text-primary">
                            Profile Pic
                        </Typography>
                        <Box className="text-center" style={{ width: "100%" }}>
                            <Box className="position-relative">
                                {formData?.dp ? (
                                    <img
                                        src={
                                            formData?.dp
                                                ? URL.createObjectURL(formData?.dp)
                                                : "/gallery.png"
                                        }
                                        alt="Uploaded"
                                        style={{
                                            width: "100%",
                                            height: "250px",
                                            borderRadius: "10px",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={"/gallery.png"}
                                        alt="Verification"
                                        className="img-fluid mb-3 mt-3"
                                        style={{
                                            width: "50%",
                                            height: "auto",
                                        }}
                                    />
                                )}
                                {!formData?.dp && (
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

                            <Box className="d-flex justify-content-between align-items-center px-3">
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
                                    onClick={() => handleRemove("dp")}
                                >
                                    Remove
                                </Button>
                                <Box className=" mt-3">
                                    {" "}
                                    <FileUploadField
                                        // label="Driver’s License"
                                        accept={"image/*"}
                                        name="dp"
                                        onFileSelect={handleUpload}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </div>
                <div className="row">
                    <div className="col">
                        <Form>
                            <Form.Group controlId="formName" className="mb-2">
                                <Form.Label>Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    className="form-control-lg"
                                    value={formData.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                />
                                {errors.name && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {errors.name}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Box className="w-100 d-flex flex-column align-items-start gap-2 mb-2">
                                <Form.Label>Phone </Form.Label>
                                <PhoneInput
                                    international
                                    defaultCountry="PK"
                                    className="p-2 rounded-2 auth_input1"
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
                            <Box className="w-100 position-relative">
                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type={confirmPasswordType}
                                        name="confirmpassword"
                                        value={formData?.confirmpassword}
                                        onChange={handleChange}
                                        className="p-2 rounded-2 auth_input1"
                                        placeholder="Re-enter Password"
                                    />
                                    {confirmPasswordType === "password" ? (
                                        <IoEyeSharp
                                            className="position-absolute translate-middle"
                                            size={24}
                                            style={{ top: "70%", right: "10px", cursor: "pointer" }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        />
                                    ) : (
                                        <IoMdEyeOff
                                            size={24}
                                            className="position-absolute translate-middle"
                                            style={{ top: "70%", right: "10px", cursor: "pointer" }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        />
                                    )}
                                </Box>
                            </Box>
                            {errors.confirmpassword && (
                                <Alert severity="error" className="w-100 mt-1">
                                    {errors.confirmpassword}
                                </Alert>
                            )}
                        </Form>
                    </div>

                    <div className="col">
                        <Form>
                            <Form.Group controlId="formName" className="mb-2">
                                <Form.Label>Email *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    className="form-control-lg"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                {errors.email && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {errors.email}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Box className="w-100 position-relative">
                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Form.Label>Password *</Form.Label>
                                    <Form.Control
                                        type={passwordType}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="p-2 rounded-2 auth_input1"
                                        placeholder="Enter Password"
                                    />
                                    {passwordType === "password" ? (
                                        <IoEyeSharp
                                            size={24}
                                            className="position-absolute translate-middle "
                                            style={{ top: "70%", right: "10px", cursor: "pointer" }}
                                            onClick={togglePasswordVisibility}
                                        />
                                    ) : (
                                        <IoMdEyeOff
                                            size={24}
                                            className="position-absolute translate-middle "
                                            style={{ top: "70%", right: "10px", cursor: "pointer" }}
                                            onClick={togglePasswordVisibility}
                                        />
                                    )}
                                </Box>
                            </Box>
                            {errors.password && (
                                <Alert severity="error" className="w-100 mt-1">
                                    {errors.password}
                                </Alert>
                            )}

                            {/* Confirm Password Field */}
                            <Form.Group controlId="formName" className="mb-2">
                                <Form.Label className="mb-3 mt-1">Address</Form.Label>
                                <App
                                    nodeData={formData.address}
                                    setNodeData={(data) => {
                                        setFormData((prev) => ({ ...prev, ["address"]: data }));
                                    }}
                                />
                                {errors.address && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {errors.address}
                                    </Alert>
                                )}
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <div className="row">
                    <Typography className="test-start fs-5 mb-1 text-primary">
                        Attach Documents
                    </Typography>
                    <div className="col-12">
                        <Form>
                            <Form.Group controlId="formName" className="mb-2">
                                <Form.Label>CNIC *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cnic"
                                    className="form-control-lg"
                                    value={formData?.cnic}
                                    onChange={handleChange}
                                    isInvalid={!!errors.cnic}
                                />
                                {errors.cnic && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {errors.cnic}
                                    </Alert>
                                )}
                            </Form.Group>

                            <Box className="w-100 d-flex flex-column align-items-start gap-2 mb-2">
                                <Form.Label>License Number *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="number"
                                    className="form-control-lg"
                                    value={formData.number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.number}
                                />
                                {errors.number && (
                                    <Alert severity="error" className="w-100">
                                        {errors.number}
                                    </Alert>
                                )}
                            </Box>
                            <Box className="w-100 d-flex flex-column align-items-start gap-2 mb-2">
                                <Form.Label>Date of Expiry *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="expiry_date"
                                    className="form-control-lg"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    isInvalid={!!errors.expiry_date}
                                />
                                {errors.expiry_date && (
                                    <Alert severity="error" className="w-100">
                                        {errors.expiry_date}
                                    </Alert>
                                )}
                            </Box>
                        </Form>
                    </div>
                </div>

                <div className="row mt-3">
                    <Box className="col-lg-6 col-md-6 d-flex flex-column ">
                        <Typography className="fs-5 mb-1 text-primary">
                            Driver License
                        </Typography>
                        <Box className="text-center" style={{ width: "100%" }}>
                            <Box className="position-relative">
                                {formData?.file ? (
                                    <img
                                        src={
                                            formData?.file
                                                ? URL.createObjectURL(formData?.file)
                                                : "/gallery.png"
                                        }
                                        alt="Uploaded"
                                        style={{
                                            width: "100%",
                                            height: "250px",
                                            borderRadius: "10px",
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={"/gallery.png"}
                                        alt="Verification"
                                        className="img-fluid mb-3 mt-3"
                                        style={{
                                            width: "50%",
                                            height: "auto",
                                        }}
                                    />
                                )}
                                {!formData?.file && (
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

                            <Box className="d-flex justify-content-between align-items-center px-3">
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
                                    onClick={() => handleRemove("file")}
                                >
                                    Remove
                                </Button>
                                <Box className=" mt-3">
                                    {" "}
                                    <FileUploadField
                                        // label="Driver’s License"
                                        accept={"image/*"}
                                        name="file"
                                        onFileSelect={handleUpload}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#f5f5f5" }}>
                <Button
                    variant="secondary-outline me-2"
                    onClick={() => handleCloseModal()}
                    sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        color: "#004FFF",
                        backgroundColor: "#ffffff",
                        border: "2px solid #0a65cc",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary ms-1"
                    onClick={handleSubmit}
                    sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        color: "#004FFF",
                        backgroundColor: "#dde4f6",
                        border: "2px solid transparent",
                        "&:hover": {
                            border: "2px solid #0a65cc",
                        },
                    }}
                >
                    Send Invite
                </Button>
            </Modal.Footer>
            <Loader loading={loading} />
        </Modal>
    );
};

export default NavModal;
