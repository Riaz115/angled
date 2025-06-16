import React, { useState } from "react";
import { Modal, Button, FormGroup, FormLabel, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiClient from "../api/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ApplyJob = ({ show, handleClose, jobtitle, jobId }) => {
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleApply = async () => {
    setError(""); // Clear previous error
    setSuccess(""); // Clear previous success message

    if (!coverLetter || coverLetter.trim() === "") {
      setError("Cover letter is required and cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        cover_letter: coverLetter,
        job: jobId,
      };

      const response = await apiClient.post(
        "/professional/api/job_application/",
        payload
      );

      if (response.status === 201) {
        toast.success("Job application submitted successfully!");
        handleClose();
        navigate("/employee/job/");
      } else {
        setError("Failed to apply for the job. Please try again.");
      }
    } catch (error) {
      console.error("Error while applying for the job:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered style={{ border: "none" }}>
      <Modal.Header>
        <Modal.Title
          style={{
            color: "#18191C",
            fontFamily: "Poppins",
            fontSize: "18px",
            fontWeight: 400,
          }}
        >
          Apply Job: {jobtitle}
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
          style={{
            color: "#004FFF", // Cross icon color
            backgroundColor: "#E7F0FA", // Background for the cross icon
            border: "none",
            borderRadius: "50%", // Rounded background for the cross
            padding: "10px", // Space around the icon
          }}
        />
      </Modal.Header>
      <Modal.Body style={{ border: "none" }}>
        {/* Error or Success Messages */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Cover Letter */}
        <FormGroup className="mb-3">
          <FormLabel
            style={{
              color: "#18191C",
              fontFamily: "Poppins",
              fontSize: "18px",
              fontWeight: 400,
            }}
          >
            Cover Letter
          </FormLabel>
          <ReactQuill
            value={coverLetter}
            onChange={setCoverLetter}
            modules={modules}
            formats={formats}
            placeholder="Write down your biography here. Let the employers know who you are..."
            style={{ height: "150px", color: "#9199A3", borderRadius: "12px" }}
          />
        </FormGroup>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          border: "none",
          marginTop: "10px",
        }}
      >
        <Button
          variant="outline"
          onClick={handleClose}
          style={{
            color: "#0A65CC",
            backgroundColor: "#E7F0FA",
            borderColor: "#E7F0FA",
          }}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={handleApply}
          style={{
            color: "#ffffff",
            backgroundColor: "#0A65CC",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply Now →"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApplyJob;
