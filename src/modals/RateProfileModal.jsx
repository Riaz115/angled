import { Box, Button, IconButton, Rating, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useSelector } from "react-redux";
import apiClient from "../api/apiClient";
import { selectUser } from "../redux/userSlice";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader/loader";

const RateProfileModal = (props) => {
  const user = useSelector(selectUser);

  const ratingsData = [
    { id: 1, label: "Punctuality", name: "punctuality" },
    { id: 2, label: "Skills", name: "skills" },
    { id: 3, label: "Behavior", name: "behavior" },
    { id: 4, label: "Communication", name: "communication" },
    { id: 5, label: "Observation", name: "observation" },
  ];

  const [ratingValues, setRatingValues] = useState({
    punctuality: 0,
    skills: 0,
    behavior: 0,
    communication: 0,
    observation: 0,
  });
  const [loading, setLoading] = useState(false);
  const [existingRatings, setExistingRatings] = useState(false);

  // Fetch initial ratings if available
  const getProfessionalRatings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/rating/${props.jobId}/get_job_rating/`
      );
      console.log(response, "this is professional ratings response");

      if (response.ok) {
        const data = response?.data || {};
        setExistingRatings(true); // Mark that ratings exist
        setRatingValues({
          punctuality: data.punctuality ?? 0,
          skills: data.skill ?? 0,
          behavior: data.behavior ?? 0,
          communication: data.communication ?? 0,
          observation: data.observation ?? 0,
        });
      }
    } catch (error) {
      console.log(error, "this is error of professional ratings response");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.jobId && user) {
      getProfessionalRatings();
    }
  }, [props.jobId, user]);

  const handleChange = (value, name) => {
    setRatingValues({ ...ratingValues, [name]: value });
  };

  // Submit new ratings
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        skill: ratingValues.skills,
        communication: ratingValues.communication,
        punctuality: ratingValues.punctuality,
        behavior: ratingValues.behavior,
        observation: ratingValues.observation,
        job: props.jobId,
        professional: props.professionalid,
      };

      const response = await apiClient.post("/facility/api/rating/", payload);

      if (response.ok) {
        toast.success("Rating submitted successfully!");
        props.getJobApplications();
        props.onHide();
      } else {
        toast.error("Failed to submit rating. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(
        "An error occurred while submitting the rating. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      className="p-0 rounded-5"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        zIndex: 10020,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Box className="mb-3">
        <Box
          className="p-3  d-flex justify-content-between align-items-center rounded-3"
          sx={{ backgroundColor: "#f1f2f4" }}
        >
          <Typography className="fw-bold fs-4">
            Rate Healthcare Professional
          </Typography>
          <IconButton onClick={props.onHide}>
            <RxCross2 size={25} />
          </IconButton>
        </Box>

        {ratingsData.map((rating, index) => (
          <Box
            key={index}
            className="p-2 fs-3 fw-bold"
            sx={{
              borderBottom:
                index !== ratingsData.length - 1 ? "1px solid #d6d6d6" : "",
            }}
          >
            <Typography className="fw-bold ms-5">{rating.label}</Typography>
            <Box className="d-flex justify-content-center">
              <Rating
                value={ratingValues[rating.name]}
                readOnly={existingRatings} // Make ratings read-only if they exist
                onChange={(event, newValue) => {
                  handleChange(newValue, rating.name);
                }}
                sx={{ color: "#000000", fontSize: "2rem" }}
                emptyIcon={<StarBorderIcon style={{ color: "#000000" }} />} // Empty star color
              />
            </Box>
          </Box>
        ))}

        {!existingRatings && ( // Show submit button only if no existing ratings
          <Box className="d-flex justify-content-center my-3">
            <Button
              onClick={handleSubmit}
              className="px-4 py-2"
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
              {loading ? "Submitting..." : "Submit Rating"}
            </Button>
          </Box>
        )}

        <Loader loading={loading} />
      </Box>
    </Modal>
  );
};

export default RateProfileModal;
