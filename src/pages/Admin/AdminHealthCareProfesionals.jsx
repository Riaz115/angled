import { Avatar, Box, Checkbox, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import TableMui from "../../mui/TableMui";
import { IoEye } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Paginate from "../../mui/Paginate";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { Loader } from "../../components/Loader/loader";
import { useEffect } from "react";
import { selectUser } from "../../redux/userSlice";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const AdminHealthCareProfesionals = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userdata, setUserData] = useState();

  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const handleSelectAll = (event) => {
    setSelectAll(event);
    if (event) {
      setSelectedItems(users.map((item) => item.id));
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

  const [pagenumber, setPageNumber] = useState(1);
  const [count, setCount] = useState();
  const [users, setUsers] = useState();

  const gethealthcareprofesionals = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/facility/api/professional/?page=${pagenumber}`
      );
      console.log(response, "this is roledata response");
      if (response.ok) {
        setCount(response?.data?.count);
        setUsers(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };

  const handleDeleteBulk = async () => {
    try {
      setLoading(true);
      const response = await apiClient.post(
        `/api/professional/bulk_delete_professional/`,
        {
          professional_ids: selectedItems,
        }
      );
      console.log(response, "this is roledata response");
      if (response.ok) {
        console.log("Users deleted successfully");
        toast.success("Users deleted successfully");
        setPageNumber(1);
        gethealthcareprofesionals();
        setSelectedItems([]);
        setIsOpen(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      gethealthcareprofesionals();
    }
  }, [user, pagenumber]);

  const handleDelete = async () => {
    try {
      console.log("user data", userdata);
      setLoading(true);
      const response = await apiClient.delete(
        `/api/professional/${userdata?.id}/`
      );
      console.log(response, "this is roledata response");
      if (response.ok) {
        console.log("User delete successfully", response);
        setPageNumber(1);
        gethealthcareprofesionals();
        toast.success("User delete successfully");
        setSelectedItems([]);
        setIsOpen(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };

  //this is for count last login
  function formatDateDifference(dateString) {
    let currentDate = new Date();
    let givenDate = new Date(dateString);

    let years = currentDate.getFullYear() - givenDate.getFullYear();
    let months = currentDate.getMonth() - givenDate.getMonth();
    let days = currentDate.getDate() - givenDate.getDate();
    let hours = currentDate.getHours() - givenDate.getHours();
    let minutes = currentDate.getMinutes() - givenDate.getMinutes();

    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
    }
    if (days < 0) {
      let prevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    let output = "";
    if (years > 0) output += `${years}y,`;
    if (months > 0) output += `${months}m,`;
    if (days > 0) output += `${days}d,`;
    if (hours > 0) output += `${hours}h,`;
    if (minutes > 0) output += `${minutes}min`;

    output = output.replace(/,$/, "");

    return output;
  }

  return (
    <Box className="p-3 bg-white ">
      <Box className="me-4 ms-4">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {selectedItems.length > 1 && (
            <FaTrash
              size={20}
              style={{
                color: "red",
                cursor: "pointer",
              }}
              onClick={handleDeleteBulk}
            />
          )}
        </div>
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
            role: "Employee preference",
            last_login: "Recent Activity",
            action: "Action",
          }}
          td={users}
          customFields={[
            {
              name: "name",
              data: (value, item) => {
                return (
                  <Box className="d-flex align-items-center gap-2 justify-content-start">
                    <Avatar src={item?.dp} />
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
              name: "role",
              data: (value, item) => {
                return (
                  <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                    {value}
                  </Typography>
                );
              },
            },
            {
              name: "last_login",
              data: (value, item) => {
                return (
                  <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                    {value ? ` ${formatDateDifference(value)} ago` : "null"}
                  </Typography>
                );
              },
            },
            {
              name: "action",
              data: (value, item) => {
                return (
                  <Box className="d-flex align-items-center gap-2 justify-content-center">
                    <IconButton
                      onClick={() =>
                        navigate(`/admin/healthcareprofesionals/${item?.id}`)
                      }
                    >
                      <IoEye style={{ color: "#7e8792" }} size={25} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setUserData(item);
                        setIsOpen(true);
                      }}
                    >
                      <RiDeleteBin6Fill
                        style={{ color: "#7e8792" }}
                        size={25}
                      />
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
                    onChange={(e) =>
                      handleCheckboxChange(item, e.target.checked)
                    }
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
        <Paginate
          count={count}
          setPageNumber={setPageNumber}
          onChange={(event, value) => {
            setPageNumber(value);
          }}
        />
        <Loader loading={loading} setLoading={setLoading} />
        <ConfirmationModal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          userName={userdata?.name}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  );
};

export default AdminHealthCareProfesionals;
