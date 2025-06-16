import { Box, Typography, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/Loader/loader";
import apiClient from "../api/apiClient";
import { RiArrowLeftSLine } from "react-icons/ri";
import { toast } from "react-toastify";

const ForgetEmail = () =>
{
    const navigate = useNavigate();
    const [ email, setEmail ] = useState( "" );
    const [ error, setError ] = useState( "" );
    const [ loading, setLoading ] = useState( false );
    const handleSubmit = async ( e ) =>
    {
        e.preventDefault();
        setError( "" );
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ( !email )
        {
            setError( "Email is required." );

        } else if ( !emailRegex.test( email ) )
        {
            setError( "Please enter a valid email address." );

        } else
        {
            console.log( "Email submitted:", email );
            try
            {
                setLoading( true );
                const response = await apiClient.post( '/api/password_reset/', {
                    email: email
                } );
                console.log( "response", response )
                if ( response.ok )
                {
                    setLoading( false );
                    const link = btoa( email )
                    navigate( `/otpset/resetpassword?code=${ link }` );
                  
                } else
                {
                    setLoading( false );
                   
                    toast.error( "We couldn't find an account associated with that email. Please try a different e-mail address." );
                }
            } catch ( error )
            {
                setLoading( false );
                console.error( 'Network error:', error );
            }
        }






    };

    return (
        <Box className="d-flex flex-row w-100" style={ { height: "100vh" } }>
            <Box
                className="w-100 p-5 bg_primary leftSignup d-flex align-items-center"
                sx={ {
                    backgroundImage: "url('../../public/signatureBG.svg')",
                    backgroundPosition: "center bottom 50px",
                    backgroundRepeat: "no-repeat",
                    overflow: "auto",
                } }
            >
                <Box className="d-flex flex-row justify-content-center align-items-center mx-auto bg-white" sx={ {
                    maxWidth: {
                        xs: "100%",
                        md: "80%",
                        lg: "70%",
                    },

                } }>
                    <Box className="w-100">
                        <form
                            className="d-flex flex-column justify-content-center align-items-center mt-3 gap-3 w-100"
                            onSubmit={ handleSubmit }
                        >
                            <Box className="p-4 d-flex flex-column justify-content-center gap-3 position-relative">
                                <Box
                                    className="position-absolute translate-middle bg-white p-0 d-flex justify-content-center align-items-center rounded-circle cursor_pointer"
                                    style={ {
                                        top: "0",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.1)",
                                    } }
                                >
                                    <img src="/exclamationIcon.svg" alt="" />
                                </Box>

                                <Typography className="fw-bold fs-4 mt-3 text-center">
                                    Forget Password
                                </Typography>
                                <Typography className="text-center fontstyleText">
                                    Enter your email and we'll send you a link to reset your password.
                                </Typography>
                                <Box className="w-100 d-flex flex-column align-items-start gap-2">
                                    <Typography className="fw-bold">Email</Typography>
                                    <input
                                        type="email"
                                        className="p-3 rounded-2 form-control"
                                        placeholder="name.surname@gmail.com"
                                        value={ email }
                                        onChange={ ( e ) => setEmail( e.target.value ) }
                                        style={ {
                                            border: "1px solid black", // Bold border with color
                                            borderRadius: "10px", // Optional: adjust border-radius if needed
                                        } }
                                    />

                                    { error && <Alert severity="error" sx={ { width: "100%" } }>
                                        { error }
                                    </Alert> }
                                </Box>
                                <Button
                                    type="submit"
                                    className="w-100 rounded-2 py-2"
                                    sx={ {
                                        textTransform: "none",
                                        color: "white",
                                        backgroundColor: "black",
                                        "&:hover": {
                                            backgroundColor: "#333333",
                                        },
                                    } }
                                >
                                    Send
                                </Button>

                                <Box className="d-flex flex-row align-items-center gap-1 justify-content-center w-100">
                                    <RiArrowLeftSLine />
                                    <Typography
                                        className="text-black"
                                        sx={ { fontSize: "12px", cursor: "pointer" } }
                                        onClick={ () =>
                                        {
                                            navigate( "/" );
                                        } }
                                    >
                                        Back to Sign In
                                    </Typography>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={ { height: "100vh" } }
                className="w-100 h-100 d-md-block d-none p-0"
            >
                <img
                    src="/signUpDoctor.svg"
                    alt=""
                    style={ {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    } }
                />
            </Box>
            <Loader loading={ loading } />
        </Box>
    );
};

export default ForgetEmail;
