import { Avatar, Box, Checkbox, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import TableMui from "../../mui/TableMui";
import Paginate from "../../mui/Paginate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import apiClient from "../../api/apiClient";
import ConfirmationModal from "../modal/ConfirmationModal";
import { Loader } from "../Loader/loader";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import moment from "moment";
import { formatDate } from "../../modules/helpers";

const Subscribed = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const [loading, setLoading] = useState(false);

  const [pagenumber, setPageNumber] = useState(1);
  const [count, setCount] = useState();
  const [users, setUsers] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [userdata, setUserData] = useState();

  const user = useSelector(selectUser);
  const navigate = useNavigate();

  const getfacility = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/facility/?page=${pagenumber}`);
      console.log(response, "this is roledata response");
      if (response.ok) {
        setCount(response?.data?.count);

        console.log("data testing", response.data);

        const filterdata = response?.data?.results?.map((item) => {
          return {
            name: item?.user?.name,
            email: item?.user?.email,
            phone: item?.user?.phone,
            hospital: item?.user?.name,
            dp: item?.dp,
            subscription: item?.created_at,
            profile_completed: item?.user?.profile_completed,
            id: item?.id,
          };
        });

        setUsers(filterdata);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      getfacility();
    }
  }, [user, pagenumber]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/api/facility/${userdata?.id}/`);
      console.log(response, "this is roledata response");
      if (response.ok) {
        console.log("User delete successfully");
        toast.success("User delete successfully");
        setIsOpen(false);
        setPageNumber(1);
        setSelectedItems([]);
        getfacility();
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
        `/api/facility/bulk_delete_facility/`,
        {
          facility_ids: selectedItems,
        }
      );
      console.log(response, "this is roledata response");
      if (response.ok) {
        console.log("Users deleted successfully");
        toast.success("Users deleted successfully");
        setPageNumber(1);
        getfacility();
        setSelectedItems([]);
        setIsOpen(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };

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
            hospital: "Hospital Name",
            subscription: "Subscription Ending",
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
              name: "hospital",
              data: (value, item) => {
                return (
                  <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                    {value}
                  </Typography>
                );
              },
            },
            {
              name: "profile_completed",
              data: (value, item) => {
                return (
                  <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                    {value ? "Completed" : "Incompleted"}
                  </Typography>
                );
              },
            },
            {
              name: "subscription",
              data: (value, item) => {
                return (
                  <Typography sx={{ color: "#7e8792", fontSize: "13px" }}>
                    {formatDate(value)}
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
                      onClick={() => navigate(`/admin/employer/${item?.id}`)}
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
            console.log(value, "this is value data of the on Chnage");
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

export default Subscribed;
