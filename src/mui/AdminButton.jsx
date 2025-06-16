import * as React from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

export default function AdminButton({ loading,name,className="" ,size, style, type,variant="contained", fullWidth ,...otherProps}) {
 
  return (
   
    <Button
      sx={style}
      variant={variant}
      size={size}
      type={type}
      fullWidth={fullWidth}
      className={className}
      disabled={!!loading}
      startIcon={loading ? <CircularProgress size={20} /> : null}
      {...otherProps}

    >
      {name}
    </Button>
  );
}

