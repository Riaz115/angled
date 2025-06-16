import { Avatar, Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import {
  FaEllipsisV,
  FaPaperclip,
  FaCamera,
  FaSmile,
  FaMicrophone,
} from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { BsEmojiGrin } from "react-icons/bs";


const AdminMessageDetail = () => {
  const isAbove576 = useMediaQuery("(min-width:576px)");
  const messages = [
    { id: 1, sender: "other", text: "Hey There!", time: "Today, 8:30pm" },
    { id: 2, sender: "other", text: "How are you?", time: "Today, 8:30pm" },
    { id: 3, sender: "me", text: "Hello!", time: "Today, 8:33pm" },
    {
      id: 4,
      sender: "me",
      text: "I am fine and how are you?",
      time: "Today, 8:34pm",
    },
    {
      id: 5,
      sender: "other",
      text: "I am doing well, Can we meet tomorrow?",
      time: "Today, 8:36pm",
    },
    { id: 6, sender: "me", text: "Yes Sure!", time: "Today, 8:58pm" },
  ];

  return (
    <Box
      className="px-sm-5 bg-white"
      style={{
        height: isAbove576 ? "calc(100vh - 90px)" : "calc(100vh - 70px)",
      }}
      sx={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
          url('../../public/signatureBG.svg')
        `,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        className="d-flex justify-content-between align-items-center p-3"
        sx={{
          borderBottom: "1px solid #cdc7c7",
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
        }}
      >
        <Box className="d-flex gap-2 align-items-center">
          <Avatar src="/chatLogo.svg" sx={{ height: "70px", width: "70px" }} />
          <Box>
            <Typography className="fw-bold">Victoria H</Typography>
            <Typography sx={{ color: "#7c7c7c" }}>
              Online - Last seen: Today, 8:00pm
            </Typography>
          </Box>
        </Box>
        <Box>
          <FaEllipsisV className="text_blue" size={20} />
        </Box>
      </Box>

      <Box
        className="p-3 d-flex flex-column gap-2"
        style={{
          maxHeight: "calc(100vh - 260px)",
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            className={`d-flex ${
              msg.sender === "me"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <Box
              className={`d-flex flex-column gap-2 ${
                msg.sender === "me" ? "align-items-end" : "align-items-start"
              }`}
            >
              <Box
                className="rounded-5 p-2 px-4"
                sx={{
                  backgroundColor: msg.sender === "me" ? "#0a65cc" : "#e7e7e7",
                }}
              >
                <Typography
                  sx={{ color: msg.sender === "me" ? "white" : "black" }}
                >
                  {msg.text}
                </Typography>
              </Box>
              <Typography
  sx={{
    fontSize: "12px",
    color: "#707070",
    display: "flex",
    alignItems: "center",
    justifyContent: msg.sender === "me" ? "flex-end" : "flex-start", // Align based on sender
  }}
>
  {msg.sender !== "me" && ( 
    <span className="mb-2"
      style={{
        height: "8px",
        width: "8px",
        backgroundColor: "#e7e7e7",
        borderRadius: "50%",
        display: "inline-block",
        marginRight: "8px",
      }}
    ></span>
  )}
  {msg.time}
  {msg.sender === "me" && ( 
    <span className="mb-2"
      style={{
        height: "8px",
        width: "8px",
        backgroundColor: "#0a65cc",
        borderRadius: "50%",
        display: "inline-block",
        marginLeft: "8px",
      }}
    ></span>
  )}
</Typography>

            </Box>
          </Box>
        ))}
      </Box>

      <Box
        className="mt-3 row"
        style={{
          bottom: "0",
          right: "0",
          width: "100%",
          padding: "10px 20px",
          margin: "0 auto",
        }}
      >
        <Box
          className="d-flex align-items-center col-8"
          style={{
            border: "1px solid #ddd",
            borderRadius: "20px",
            padding: "5px 10px",
            backgroundColor: "#F1F7FC",
            flex: 1,
          }}
        >
          <FaPaperclip
            size={20}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Type your message here..."
            style={{
              flexGrow: 1,
              padding: "10px",
              backgroundColor: "#F1F7FC",
              outline: "none",
              border: "none",
            }}
          />
          <BsEmojiGrin
            size={24}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <IoCameraOutline
            size={24}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
        </Box>

        <Box
          className="col-1 me-4 ms-1 mt-1"
          style={{
            backgroundColor: "#0A65CC",
            borderRadius: "10%",
            display: "flex",
            alignItems: "center",
            height: "50px",
            width: "50px",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaMicrophone size={20} color="white" />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminMessageDetail;
