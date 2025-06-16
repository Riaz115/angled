import React from "react";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";

const DateField = ({name="Date",value, change,...otherProps}) => {
  return (

      <TextField
         name="someDate"
        label={name}
        // defaultValue={new Date().toISOString().split('T')[0]}
        InputLabelProps={{ shrink: true, required: true }}
        type="date"
       
        value={value}
        onChange={change}
        {...otherProps}
        // defaultValue={values.someDate}
      />

  );
};

export default DateField;
