import { Box, Button, IconButton, Typography } from "@mui/material";
import React from "react";
import { Modal } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";

const ImportJobsModal = (props) => {
  return (
    <Modal
      {...props}
      size="md"
      className="p-0 rounded-3"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ zIndex: 10020, backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <Box>
        <Box
          className="p-3 d-flex justify-content-between align-items-center rounded-3"
          sx={{ backgroundColor: "#f1f2f4" }}
        >
          <Typography className="fw-bold fs-5">Import Jobs</Typography>
          <IconButton onClick={props.onHide}>
            <RxCross2 size={25} />
          </IconButton>
        </Box>
        <Box className="d-flex flex-column justify-content-center align-items-center gap-3 my-5">
          <img src="/importIcon.svg" alt="importicon" className="img-fluid" />
          <Typography className="text-center">
            Drag and Drop files to <br />
            upload <br /> or
          </Typography>

          <Button
            onClick={props.onHide}
            className={`px-4 py-2 `}
            sx={{
              textTransform: "none",
              backgroundColor: "#0a65cc",
              color: "white",
              "&:hover": {
                backgroundColor: "#0a65cc",
              },
            }}
          >
            Browse
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImportJobsModal;
