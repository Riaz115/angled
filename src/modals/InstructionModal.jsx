import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import { selectUser } from "../redux/userSlice";
import { Loader } from "../components/Loader/loader";
import { useSelector } from "react-redux";

const InstructionModal = (props) => {
  const user = useSelector(selectUser);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingInstruction, setExistingInstruction] = useState(null);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
  ];

  const getInstruction = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/instruction/${props.jobId}/get_job_instruction/`
      );
      console.log(response, "this is instruction response");

      if (response.ok) {
        const data = response?.data || {};
        if (data && data.instruction) {
          setExistingInstruction(data);
          setContent(data.instruction);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error getting instruction");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.jobId && user) {
      getInstruction();
    }
  }, [props.jobId, user]);

  const handleSubmit = async () => {
    try {
      setLoading(true); // Start loading

      const payload = {
        job: props.jobId,
        instruction: content,
      };

      let response;
      if (existingInstruction) {
        response = await apiClient.patch(
          `/facility/api/instruction/${existingInstruction.id}/`,
          payload
        );
      } else {
        response = await apiClient.post("/facility/api/instruction/", payload);
      }

      if (response.status === 200 || response.status === 201) {
        console.log("Instruction submitted successfully:", response.data);
        toast.success("Instruction submitted successfully");
        props.onHide(); // Close the modal after success
      } else {
        console.log("Failed to submit instruction:", response.data);
        toast.error("Failed to submit instruction. Please try again.");
      }
    } catch (error) {
      console.log("Error submitting instruction:", error);
      toast.error("An error occurred while submitting the instruction.");
    } finally {
      setLoading(false);
    }
  };

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
          <Typography className="fw-bold fs-5">
            {existingInstruction ? "Update Instruction" : "Add Instruction"}
          </Typography>
          <IconButton onClick={props.onHide}>
            <RxCross2 size={25} />
          </IconButton>
        </Box>

        <Box className="p-3">
          <Typography className="text_blue fs-5">Instructions</Typography>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your instructions here..."
          />
        </Box>
        <Box className="d-flex justify-content-end my-3 pe-3">
          <Button
            onClick={handleSubmit} // Trigger handleSubmit on click
            className={`px-4 py-2`}
            sx={{
              textTransform: "none",
              backgroundColor: "#0a65cc",
              color: "white",
              "&:hover": {
                backgroundColor: "#0a65cc",
              },
            }}
            disabled={loading} // Disable button when loading
          >
            {existingInstruction ? "Update" : "Submit"}
          </Button>
        </Box>
      </Box>
      <Loader loading={loading} />
    </Modal>
  );
};

export default InstructionModal;
