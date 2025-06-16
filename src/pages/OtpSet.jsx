import { Box, Typography, Checkbox, Button, FormHelperText } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller, useForm } from "react-hook-form";
import apiClient, { setAuthToken } from "../api/apiClient";
import { Loader } from "../components/Loader/loader";
import { toast } from "react-toastify";
import { useParams ,useNavigate,useLocation} from "react-router-dom";
import { encryptUserData } from "../api/reuse";
import { addUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { encryptKey } from "../config";


const OtpSet = () => {
    const [loading,setLoading]=useState(false)
    const {id}=useParams();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            otp: ""
        }
    });
    const navigate=useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const dispatch=useDispatch();

    const onSubmit = async(data) => {
        if(id==="resetpassword"){
            try {
                setLoading(true)
                const response = await apiClient.post('/api/validate_token/', {
                  token: data?.otp,
                }); 
                console.log(response,"this is response data");
                if (response.ok) {
                    toast.success(" verified successfully")
                    setLoading(false)
                    navigate(`/changepassword?code=${btoa(data?.otp)}`)
                } else {
                  setLoading(false)
                  if(response.status===400){
                    toast.error(response.data?.detail)
                  }else{
                    // console.log("how are you",response.data?.detail)
                    toast.error(response.data?.detail)
                  }
                }
              } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
                toast.error(error.message);
              }

        }else{

            try {
                setLoading(true)
                const response = await apiClient.post('/api/users/activate/', {
                  token: data?.otp,
                }); 
                console.log(response,"this is response data");
                if (response.ok) {
                    toast.success("User verified successfully")
                    setLoading(false)

                    dispatch(addUser({access:response?.data?.access, ...response?.data?.user}))
                    const admin = encryptUserData({access:response?.data?.access, ...response?.data?.user},encryptKey);
                    localStorage.setItem('USER_STRING', JSON.stringify(admin));
                if(response.data?.user?.profile_completed){
                    setAuthToken(response.data?.access)
                    if(response?.data?.user.type=="P"){
    
                        navigate("/find-employee/job")
                    }else if(response?.data?.user.type==="F"){
                        navigate("/employer/dashboard")
                        
                    }else{
                        navigate("/admin/dashboard")
    
                    }
                }else{
                    navigate("/create-profile")
                }
                } else {
                  setLoading(false)
                  if(response.status===400){
                    toast.error(response.data?.details)
                  }else{
                    toast.error("Error Otp")
                  }
                }
              } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
                toast.error(error.message);
              }
        }
    };

    const onRefresh=async()=>{
        if(!id){
            return null;
        }

        if(code){
            console.log(atob(code))
            atob(code)
            try {
                setLoading(true)
                const response = await apiClient.post('/api/password_reset/', {
                  email: atob(code),
                }); 
                console.log(response,"this is response data");
                if (response.ok) {
                    toast.success("Send Otp successfully")
                    setLoading(false)
                //   navigate(`/otpset/${response.data.id}`)
                } else {
                  setLoading(false)
                  if(response.status===400){
                    toast.error(response?.data?.details)
                  }else{
                    toast.error("Error Otp")
                  }
                }
              } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
                toast.error(error.message);
              }

        }else{

            try {
                setLoading(true)
                const response = await apiClient.post('/api/users/resend_activation_token/', {
                  id: id,
                }); 
                console.log(response,"this is response data");
                if (response.ok) {
                    toast.success("Send Otp successfully")
                    setLoading(false)
                //   navigate(`/otpset/${response.data.id}`)
                } else {
                  setLoading(false)
                  if(response.status===400){
                    toast.error(response?.data?.details)
                  }else{
                    toast.error("Error Otp")
                  }
                }
              } catch (error) {
                setLoading(false)
                console.error('Network error:', error);
                toast.error(error.message);
              }

        }


    }

    return (

        <Box className="d-flex flex-row w-100" style={{ height: "100vh" }}>
            <Box
                className="w-100 p-5 bg_primary  leftSignup d-flex align-items-center"
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
                    height: {
                        xs: "90%",
                        md: "75%",
                        lg: "70%",
                    }
                }}>
                    <Box
                        className="w-100"


                    >
                        <form className="d-flex flex-column justify-content-center align-items-center mt-3 gap-3 w-100">


                            <Box className="p-4 d-flex flex-column justify-content-center gap-3 position-relative">
                          

                                <Typography className="fw-bold fs-4 mt-3 text-center ">
                                    Verify
                                </Typography>
                                <Typography className="text-center">
                                    Your code was send to you via email
                                </Typography>
                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Controller
                                        name="otp"
                                        control={control}
                                        rules={{ validate: (value) => value.length === 5 }}
                                        render={({ field, fieldState }) => (
                                            <Box>
                                                <MuiOtpInput sx={{ gap: 1 }} {...field} length={5} />
                                                {fieldState.invalid ? (
                                                    <FormHelperText error>OTP invalid</FormHelperText>
                                                ) : null}
                                            </Box>
                                        )}
                                    />
                                </Box>
                                <Button
                                    className="w-100 rounded-2 py-2 "
                                    sx={{
                                        textTransform: "none",
                                        color: "white",
                                        backgroundColor: "black",
                                        "&:hover": {
                                            backgroundColor: "#333333",
                                        },
                                    }}

                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Verify
                                </Button>
                                <Box className="d-flex flex-row align-items-center gap-1 justify-content-center w-100">
                                    <Typography

                                        className="text-black"
                                        sx={{ fontSize: "12px" }}
                                   
                                    >
                                        Didn't receive code?
                                    </Typography>
                                    <Typography

                                        className="text-primary"
                                        sx={{ fontSize: "12px", cursor: "pointer" }}
                                        onClick={() => {
                                            onRefresh();
                                        }}
                                    >
                                        Request again
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
            <Loader loading={loading} />
        </Box>


        // <Box>

        //     <form onSubmit={handleSubmit(onSubmit)}>

        //         <div>
        //             <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        //                 Submit
        //             </Button>
        //         </div>
        //     </form>
        // </Box>
    )
}
export default OtpSet