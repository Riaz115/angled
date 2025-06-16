import React, { useRef } from 'react'
import { Box, Button, Typography } from '@mui/material';

import UploadIcon from '@mui/icons-material/Upload';

const FileUploadField = ({ label, name, onFileSelect, accept }) => {
    const fileInputRef = useRef(null);
  
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
  
    const handleFileChange = (event) => {
      const files = event.target.files[0];
  
      onFileSelect(name, files); // Pass the selected files to the parent
  
    };
  
    return (
      <Box sx={{ marginBottom: 3, }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={accept}
        // accept="image/*"
        />
        <Button
          sx={{
            color: "black",
            border: "1px solid #858687",
            backgroundColor: "transparent",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f2f2f2",
            },
            display: "flex",
            justifyContent: "space-between"
          }}
          className="px-4 d-flex justify-content-between"
          onClick={handleButtonClick}
        >
          <span>Upload</span>
          <UploadIcon />
        </Button>
      </Box>
    );
  };

export default FileUploadField