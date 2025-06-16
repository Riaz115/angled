import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";
import { RiArrowLeftSLine } from "react-icons/ri";

const ForgetPasswordModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      className="p-0"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Box className="p-4 d-flex flex-column justify-content-center gap-3 position-relative">
        <Box
          className="position-absolute translate-middle bg-white p-0 d-flex justify-content-center align-items-center rounded-circle cursor_pointer"
          style={{
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.1)",
          }}
        >
          <img src="/exclamationIcon.svg" alt="" />
        </Box>

        <Typography className="fw-bold fs-4 mt-3 text-center">
          Forget Password
        </Typography>
        <Typography className="text-center">
          Enter your email and we'll send you a link to reset your password.
        </Typography>
        <Box className="w-100 d-flex flex-column align-items-start gap-2">
          <Typography className="text-black fw-bold">Email</Typography>
          <input
            type="email"
            className="p-3 rounded-2 form-control"
            placeholder="name.surname@gmail.com"
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
        >
          Send
        </Button>
        <Box className="d-flex flex-row align-items-center gap-1 justify-content-center w-100">
          <RiArrowLeftSLine />
          <Typography
            className="text-black"
            sx={{ fontSize: "12px", cursor: "pointer" }}
            onClick={props.onHide}
          >
            Back to Sign In
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ForgetPasswordModal;
