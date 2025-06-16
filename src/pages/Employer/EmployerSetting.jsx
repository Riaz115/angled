import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import apiClient from "../../api/apiClient";
import { Typography, Button, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Personal from "./ProfileSettings/Personal";
import EditProfile from "./ProfileSettings/EditProfile";

const EmployerSetting = () => {
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/facility/api/profile/`);
      if (response.ok) {
        setProfile(response?.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="mt-3 h-full">
      {isEditing ? (
        <EditProfile
          userprofile={profile}
          getProfile={getProfile}
          setIsEditing={setIsEditing}
        />
      ) : (
        <Personal userprofile={profile} setIsEditing={setIsEditing} />
      )}
    </div>
  );
};

export default EmployerSetting;
