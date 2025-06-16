import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";

const WrongCredentialsModal = (props) => {
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
          onClick={() => props.onHide()}
          className="position-absolute translate-middle bg-white p-0 d-flex justify-content-center align-items-center rounded-circle cursor_pointer"
          style={{
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0px 0px 5px 5px rgb(0,0,0,0.1)",
          }}
        >
          <img src="/wrongIcon.svg" alt="" />
        </Box>

        <Typography className="text-center mt-4">
          Email or Password is incorrect, please enter correct credentials.
        </Typography>

        <Button
          onClick={props.onHide}
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
          Ok
        </Button>
      </Box>
    </Modal>
  );
};

export default WrongCredentialsModal;
