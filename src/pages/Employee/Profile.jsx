import React, { useEffect, useState } from "react";
import CustomTabs from "../../mui/CustomTabs";
import Personal from "../Employee/Profile/Personal";
import EditProfile from "../Employee/Profile/EditProfile";
import Document from "../Employee/Profile/Document";
import EditDocument from "../Employee/Profile/EditDocument";
import AccountSettings from "../Employee/Profile/AccountSettings";
import { useOutletContext } from "react-router-dom";

const Profile = () => {
  const { userprofile, setUserprofile } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDocument, setIsEditingDocument] = useState(false);
  const [editCardData, setEditCardData] = useState(null);
  const tabs = ["Personal", "Document", "Account Settings"];
  const panels = [
    isEditing ? (
      <EditProfile
        userprofile={userprofile}
        setUserprofile={setUserprofile}
        setIsEditing={setIsEditing}
      />
    ) : (
      <Personal userprofile={userprofile} setIsEditing={setIsEditing} />
    ),
    isEditingDocument ? (
      <EditDocument
        setUserprofile={setUserprofile}
        userprofile={userprofile}
        setIsEditingDocument={setIsEditingDocument}
        card={editCardData}
      />
    ) : (
      <Document
        setIsEditingDocument={setIsEditingDocument}
        userprofile={userprofile}
        setEditCardData={setEditCardData}
      />
    ),
    <AccountSettings />,
  ];

  return (
    <div className="px-sm-5 p-4" style={{ backgroundColor: "#f5f5f5" }}>
      <h3 className="ms-4">Profile</h3>
      <div className="mt-3">
        <CustomTabs
          setIsEditingDocument={setIsEditingDocument}
          tabs={tabs}
          panels={panels}
        />
      </div>
    </div>
  );
};

export default Profile;
