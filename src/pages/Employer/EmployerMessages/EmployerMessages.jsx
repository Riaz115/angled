import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import { IoMdDoneAll } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const EmployerMessages = () => {
  const navigate = useNavigate();
  const chatData = [
    {
      id: 1,
      name: "Victoria H",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "delivered",
      count: 0,
    },
    {
      id: 2,
      name: "John Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noread",
      count: 2,
    },
    {
      id: 3,
      name: "Jane Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "delivered",
      count: 0,
    },
    {
      id: 4,
      name: "John Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noread",
      count: 1,
    },
    {
      id: 5,
      name: "Jane Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "delivered",
      count: 0,
    },
    {
      id: 6,
      name: "John Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noread",
      count: 1,
    },
    {
      id: 7,
      name: "Jane Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noraed",
      count: 5,
    },
    {
      id: 8,
      name: "John Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noread",
      count: 1,
    },
    {
      id: 9,
      name: "Jane Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "delivered",
      count: 0,
    },
    {
      id: 10,
      name: "John Doe",
      highlightedMsg: "Hello, I am interested in the job",
      time: "Today, 9.52pm",
      status: "noread",
      count: 1,
    },
  ];
  return (
    <Box
      className="bg-white px-sm-5 p-4"
      sx={{
        backgroundImage: `
linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
url('../../public/signatureBG.svg')
`,
        backgroundPosition: "center top",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        overflow: "auto",
      }}
    >
      {chatData.map((item, index) => (
        <Box
          onClick={() => navigate(`/employer/messages/${item.id}`)}
          key={index}
          className="d-flex align-items-center justify-content-between p-3 "
          sx={{ borderBottom: "1px solid #cdc7c7", cursor: "pointer" }}
        >
          <Box className="d-flex align-items-center gap-2">
            <Avatar
              src="/chatLogo.svg"
              sx={{ height: "70px", width: "70px" }}
            />
            <Box>
              <Typography className="fw-bold">{item.name}</Typography>
              <Typography sx={{ color: "#7c7c7c" }}>
                {item.highlightedMsg}
              </Typography>
            </Box>
          </Box>
          <Box className="text-end">
            <Typography sx={{ color: "#7c7c7c" }}>{item.time}</Typography>
            {item.status === "noread" ? (
              <Typography
                component={"span"}
                sx={{ backgroundColor: "#f24e1e", fontSize: "12px" }}
                className="rounded-5 p-1 text-white px-2"
              >
                {item.count}
              </Typography>
            ) : (
              <IoMdDoneAll style={{ color: "#9747ff" }} />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default EmployerMessages;





