import { Avatar, Box, Checkbox, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import TableMui from "../../mui/TableMui";
import Paginate from "../../mui/Paginate";

const tableData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    expertise: "Electrician",
    recentActivity: "10 minutes ago",
    image: "/tableNameDp.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    expertise: "Carpenter",
    recentActivity: "15 minutes ago",
    image: "/tableImg3.svg",
  },
  {
    id: 3,
    name: "Mark Taylor",
    email: "marktaylor@example.com",
    expertise: "Plumber",
    recentActivity: "30 minutes ago",
    image: "/tableImg2.svg",
  },
  {
    id: 4,
    name: "Emily Johnson",
    email: "emilyj@example.com",
    expertise: "Painter",
    recentActivity: "1 hour ago",
    image: "/tableImg4.svg",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michaelbrown@example.com",
    expertise: "Welder",
    recentActivity: "2 hours ago",
    image: "/tableImg5.svg",
  },
  {
    id: 6,
    name: "Laura Wilson",
    email: "lauraw@example.com",
    expertise: "Electrician",
    recentActivity: "3 hours ago",
    image: "/tableImg4.svg",
  },
  {
    id: 7,
    name: "Chris Evans",
    email: "chrisevans@example.com",
    expertise: "Mechanic",
    recentActivity: "5 hours ago",
    image: "/tableImg2.svg",
  },
  {
    id: 8,
    name: "Sarah Miller",
    email: "sarahm@example.com",
    expertise: "Mason",
    recentActivity: "Yesterday",
    image: "/tableImg5.svg",
  },
  {
    id: 9,
    name: "David Anderson",
    email: "davidanderson@example.com",
    expertise: "Plumber",
    recentActivity: "2 days ago",
    image: "/tableImg2.svg",
  },
  {
    id: 10,
    name: "Sophia White",
    email: "sophiaw@example.com",
    expertise: "Carpenter",
    recentActivity: "3 days ago",
    image: "/tableImg5.svg",
  },
];

const NonSubscribed = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (event) => {
    setSelectAll(event);
    if (event) {
      setSelectedItems(tableData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = (item, isChecked) => {
    if (isChecked) {
      setSelectedItems((prev) => [...prev, item.id]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== item.id));
    }
  };
  return (
    <Box className=" bg-white pb-5">
      <TableMui
        headerRounded={true}
        onSort={(field, direction) => {
          let value = direction === "asc" ? field : "-" + field;
        }}
        styleTableTh={{
          color: "#7e8792",
          fontWeight: "normal",
          whiteSpace: "nowrap",
          bgcolor: "#eeeeee",
          padding: "5px",
        }}
        th={{
          checkbox: (
            <Checkbox
              checked={selectAll}
              onChange={() => handleSelectAll(!selectAll)}
              sx={{
                color: "black",
                "&.Mui-checked": {
                  color: "#0a65cc",
                },
              }}
            />
          ),
          name: "Name",
          email: "Email",
          expertise: "Expertise",
          recentActivity: "Recent Activity",
          action: "Action",
        }}
        td={tableData}
        customFields={[
          {
            name: "name",
            data: (value, item) => {
              return (
                <Box className="d-flex align-items-center gap-2 justify-content-start">
                  <Avatar src={item?.image} />
                  <Typography sx={{ fontSize: "13px" }}>{value}</Typography>
                </Box>
              );
            },
          },
          {
            name: "email",
            data: (value, item) => {
              return (
                <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                  {value}
                </Typography>
              );
            },
          },
          {
            name: "expertise",
            data: (value, item) => {
              return (
                <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                  {value}
                </Typography>
              );
            },
          },
          {
            name: "recentActivity",
            data: (value, item) => {
              return (
                <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                  {value}
                </Typography>
              );
            },
          },
          {
            name: "action",
            data: (value, item) => {
              return (
                <Box className="d-flex align-items-center gap-2 justify-content-center">
                  <IconButton>
                    <IoEye style={{ color: "#7e8792" }} size={25} />
                  </IconButton>
                  <IconButton>
                    <RiDeleteBin6Fill style={{ color: "#7e8792" }} size={25} />
                  </IconButton>
                </Box>
              );
            },
          },
          {
            name: "checkbox",
            data: (value, item) => {
              return (
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                  sx={{
                    color: "#7e8792",
                    "&.Mui-checked": {
                      color: "#0a65cc",
                    },
                  }}
                />
              );
            },
          },
        ]}
      />
      <Paginate />
    </Box>
  );
};

export default NonSubscribed;
