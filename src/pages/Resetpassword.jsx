import { Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Loader } from "../components/Loader/loader";
import apiClient from "../api/apiClient";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { encryptUserData } from "../api/reuse";
import { encryptKey } from "../config";
import { selectUser } from "../redux/userSlice";
import { useSelector } from "react-redux";
import { RepeatOneSharp } from "@mui/icons-material";
const ChangePassword = () => {
    const user = useSelector(selectUser);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const handlePasswordChange = async(e) => {
        e.preventDefault();
        setError("");
    
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }
    try {
        setLoading(true);
        const response = await apiClient.post('/api/password_reset/confirm/', {
          password:newPassword,
          token:atob(code)
        });
  
        if (response.ok) {
        
            
          setLoading(false);
          toast.success("Password Reset successfully")
          const admin = encryptUserData({access:response?.data?.access, ...user},encryptKey);
          localStorage.setItem('USER_STRING', JSON.stringify(admin));
        navigate("/")
          
        } else {
          setLoading(false);

            if(response.data.detail){

                toast.error(response.data.detail);
            }
            else{
                if(response?.data?.password){
                    response.data?.password?.forEach(element => {
                        toast.error(element);
                    });
                }

            }
          
        }
      } catch (error) {
        setLoading(false);
        console.error('Network error:', error);
      }
    };

    return (
        <Box className="d-flex flex-row w-100" style={{ height: "100vh" }}>
            <Box
                className="w-100 p-5 bg_primary leftSignup d-flex align-items-center"
                sx={{
                    backgroundImage: "url('../../public/signatureBG.svg')",
                    backgroundPosition: "center bottom 50px",
                    backgroundRepeat: "no-repeat",
                    overflow: "auto",
                }}
            >
                <Box className="d-flex flex-row justify-content-center align-items-center mx-auto bg-white" sx={{
                    width: {
                        xs: "100%",
                        md: "80%",
                        lg: "70%",
                    },
                   minHeight: {
                        xs: "80%",
                        md: "75%",
                        lg: "85%",
                    }
                }}>
                    <Box className="w-100">
                        <form className="d-flex flex-column justify-content-center align-items-center mt-3 gap-3 w-100" onSubmit={handlePasswordChange}>
                            <Box className="p-4 d-flex flex-column justify-content-center gap-3 position-relative w-100">
                                <Typography className="fw-bold fs-4 mt-3 text-center">
                                    Change Password
                                </Typography>
                                {error && (
                                    <Typography color="error" className="text-center">
                                        {error}
                                    </Typography>
                                )}

                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Typography className="fw-bold">New Password</Typography>
                                    <input
                                        type="password"
                                        className="p-3 rounded-2 form-control"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Box>
                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Typography className="fw-bold">Confirm New Password</Typography>
                                    <input
                                        type="password"
                                        
                                        className="p-3 rounded-2 form-control w-100"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Box>
                                <Button
                                    type="submit"
                                    className="w-100 rounded-2 py-2"
                                    sx={{
                                        textTransform: "none",
                                        color: "white",
                                        backgroundColor: "black",
                                        "&:hover": {
                                            backgroundColor: "#333333",
                                        },
                                    }}
                                >
                                    Change Password
                                </Button>
                                <Box className="d-flex flex-row align-items-center gap-1 justify-content-center w-100">
                                    <RiArrowLeftSLine />
                                    <Typography
                                        className="text-black"
                                        sx={{ fontSize: "12px", cursor: "pointer" }}
                                        onClick={() => navigate("/")}
                                    >
                                        Back to Signin
                                    </Typography>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{ height: "100vh" }}
                className="w-100 h-100 d-md-block d-none p-0"
            >
                <img
                    src="/signUpDoctor.svg"
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </Box>
            <Loader loading={loading}/>
        </Box>
    );
};

export default ChangePassword;

