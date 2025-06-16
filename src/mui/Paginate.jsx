import React from "react";
import { Box, Pagination } from "@mui/material";

const Paginate = ({ count = 22, limit = 10, onChange, defaultNumber }) => {
  if (count == 0) return;
  return (
    <Box display="flex" justifyContent="flex-end" mt={2}>
      <Pagination
        count={Math.ceil(count / limit)}
        // count={count}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "secondary", // Change this to your custom color
            "&.Mui-selected": {
              backgroundColor: "#0a65cc", // Change this to your custom selected color
              color: "white", // Change text color if needed
            },
            "&:hover": {
              backgroundColor: "#0a65cc", // Change this to your custom hover color
            },
          },
        }}
        // color="secondary"
        // variant="outlined"
        // shape="rounded"
        defaultPage={defaultNumber}
        onChange={(event, value) => onChange(event, value)}
      />
    </Box>
  );
};
export default Paginate;
