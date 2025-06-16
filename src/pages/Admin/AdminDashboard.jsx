import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SemiDonutChart from "../../components/SemiDonutChart";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowUp } from "react-icons/io";
import { IoMdArrowDown } from "react-icons/io";
import { IoEye, IoOptions } from "react-icons/io5";
import TableMui from "../../mui/TableMui";
import Paginate from "../../mui/Paginate";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import apiClient from "../../api/apiClient";

const tableData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    total: "$205",
    status: "Non-Sub",
    image: "/tableNameDp.svg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    total: "$205",
    status: "Non-Sub",
    image: "/tableImg3.svg",
  },
  {
    id: 3,
    name: "Mark Taylor",
    email: "marktaylor@example.com",
    total: "$205",
    status: "inactive",
    image: "/tableImg2.svg",
  },
  {
    id: 4,
    name: "Emily Johnson",
    email: "emilyj@example.com",
    total: "$205",
    status: "inactive",
    image: "/tableImg4.svg",
  },
  {
    id: 5,
    name: "Michael Brown",
    email: "michaelbrown@example.com",
    total: "$205",
    status: "active",
    image: "/tableImg5.svg",
  },
  {
    id: 6,
    name: "Laura Wilson",
    email: "lauraw@example.com",
    total: "$205",
    status: "active",
    image: "/tableImg4.svg",
  },
  {
    id: 7,
    name: "Chris Evans",
    email: "chrisevans@example.com",
    total: "$205",
    status: "Non-Sub",
    image: "/tableImg2.svg",
  },
  {
    id: 8,
    name: "Sarah Miller",
    email: "sarahm@example.com",
    total: "$205",
    status: "active",
    image: "/tableImg5.svg",
  },
];
const AdminDashboard = () => {
  const user = useSelector(selectUser);
  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(false);

  const getdashboarddata = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/admin_dashboard/`);
      console.log(response, "this is  response");
      if (response.ok) {
        setDashboardData(response?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getdashboarddata();
    }
  }, [user]);

  const cardsData = [
    {
      id: 1,
      title: "Total Subscriptions",
      amount: "$75,000",
      percentage: "+10%",
      backgroundColor: "#1d1f2c",
      icon: "/totalSubscriptionIcon.svg",
    },
    {
      id: 2,
      title: "Total Healthcare Professionals",
      amount: dashboardData?.professional_count || 0,
      percentage: "+15%",
      backgroundColor: "#883dcf",
      icon: "/totalHealthCareIcon.svg",
    },
    {
      id: 3,
      title: "Total Employers",
      amount: dashboardData?.facility_count || 0,
      percentage: "-25%",
      backgroundColor: "#3250ff",
      icon: "/totalEmployersIcon.svg",
    },
    {
      id: 4,
      title: "Total Jobs Posted",
      amount: dashboardData?.job_count || 0,
      percentage: "0%",
      backgroundColor: "#2bb2fe",
      icon: "/totalJobPostedIcon.svg",
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", // Full viewport height
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="bg-white px-sm-5 p-4">
      <Box className="me-1 ms-1">
        <Box className="row">
          {cardsData.map((item, index) => (
            <Box className="col-xxl-3 col-lg-3 col-sm-6 p-1" key={index}>
              <Box
                sx={{ backgroundColor: item.backgroundColor, height: "180px" }}
                className="rounded-4 p-4 d-flex flex-column gap-3"
              >
                <img src={item.icon} style={{ width: "40px" }} />
                <Typography sx={{ color: "white" }}>{item.title}</Typography>
                <Typography className="text-white fs-3">
                  {item.amount}{" "}
                  <Typography
                    component={"span"}
                    sx={{ fontSize: "12px", backgroundColor: "transparent" }}
                    className="p-2 rounded-3"
                  >
                    {item.percentage}{" "}
                  </Typography>{" "}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box className="mt-3 row">
          <Box className="col-xl-5 col-12 p-1">
            <Box className="d-flex flex-column gap-3 card rounded-4 p-3 position-relative">
              <Box className="d-flex justify-content-between align-items-center">
                <Typography className="fw-bold fs-5">
                  Subscriptions <br />{" "}
                  <Typography
                    component={"span"}
                    sx={{ color: "#777980", fontSize: "14px" }}
                  >
                    Employer Subscriptions
                  </Typography>
                </Typography>
                <BsThreeDotsVertical />
              </Box>

              <SemiDonutChart value={75.55} color="#883dcf" />
              <Typography
                className="fw-bold fs-3 position-absolute"
                sx={{
                  left: {
                    xs: "42%",
                    lg: "40%",
                  },
                  top: "48%",
                }}
              >
                75.55%
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  backgroundColor: "#e9faf7",
                  color: "#1a9882",
                  width: "fit-content",
                  left: "44%",
                  top: "58%",
                }}
                className="p-2 rounded-3 position-absolute fw-bold"
              >
                +10%
              </Typography>
              <Typography
                className="text-center"
                sx={{ color: "#6e778b", fontSize: "14px" }}
              >
                You succeed earn $240 This month, its higher <br /> than
                Previous
              </Typography>
              <Box className="d-flex align-items-center justify-content-around">
                <Box>
                  <Typography sx={{ color: "#6e778b", fontSize: "14px" }}>
                    Target
                  </Typography>
                  <Typography className="fw-bold fs-5">
                    $20k <IoMdArrowDown style={{ color: "#eb3d4d" }} />
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#6e778b", fontSize: "14px" }}>
                    Revenue
                  </Typography>
                  <Typography className="fw-bold fs-5">
                    $16k <IoMdArrowUp style={{ color: "#22caad" }} />
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#6e778b", fontSize: "14px" }}>
                    Today
                  </Typography>
                  <Typography className="fw-bold fs-5">
                    $1.5k
                    <IoMdArrowUp style={{ color: "#22caad" }} />
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="mt-3 d-flex flex-column gap-3 card rounded-4 p-3 position-relative">
              <Box className="d-flex justify-content-between align-items-center">
                <Typography className="fw-bold fs-5">
                  Subscriptions <br />{" "}
                  <Typography
                    component={"span"}
                    sx={{ color: "#777980", fontSize: "14px" }}
                  >
                    Employer’s Subscriptions Percentage
                  </Typography>
                </Typography>
                <BsThreeDotsVertical />
              </Box>
              <div
                style={{
                  position: "relative",
                  margin: "10px",
                  height: "200px",
                  marginLeft: "20%",
                }}
              >
                {/* Large Green Circle */}
                <div
                  style={{
                    position: "absolute",
                    width: "180px",
                    height: "180px",
                    left: "20px",
                    backgroundColor: "#1a9882",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    top: "20px",
                  }}
                >
                  58.33%
                </div>

                {/* Medium Blue Circle */}
                <div
                  style={{
                    position: "absolute",
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#2bb2fe",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    left: "120px",
                    top: "30px",
                    zIndex: "2",
                  }}
                >
                  25%
                </div>

                {/* Small Red Circle */}
                <div
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#eb3d4d",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    left: "110px",
                    top: "130px",
                    zIndex: "3",
                  }}
                >
                  8%
                </div>
              </div>
            </Box>
          </Box>
          <Box className="col-xl-7 col-12 p-1">
            <Box className="card p-3 rounded-4">
              <Box className="d-flex align-items-center justify-content-between">
                <Typography className="fw-bold fs-5">
                  Employers{" "}
                  <Typography
                    component={"span"}
                    sx={{
                      fontSize: "14px",
                      backgroundColor: "#e9faf7",
                      color: "#1a9882",
                    }}
                    className="p-2 rounded-3 fw-bold"
                  >
                    +2 Orders
                  </Typography>
                </Typography>
                <Box className="d-flex align-items-center gap-3 ">
                  <Box
                    className="p-2 d-flex gap-2 align-items-center rounded-3"
                    sx={{
                      border: "1px solid #e0e2e7",
                      color: "#667085",
                      cursor: "pointer",
                    }}
                  >
                    <IoOptions />
                    <Typography>Filters</Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      backgroundColor: "#f4ecfb",
                      color: "#883dcf",
                      cursor: "pointer",
                    }}
                    className="p-2 rounded-3 fw-bold"
                  >
                    See All
                  </Typography>
                </Box>
              </Box>
              <Box
                className="mt-3"
                sx={{ maxHeight: "700px", overflowY: "auto" }}
              >
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
                    employers: "Employers",
                    total: "Total",
                    status: "Status",
                    action: "Action",
                  }}
                  td={tableData}
                  customFields={[
                    {
                      name: "employers",
                      data: (value, item) => {
                        return (
                          <Box className="d-flex align-items-center gap-2 justify-content-start">
                            <Avatar src={item?.image} />
                            <Box className="text-start">
                              <Typography className="fw-bold">
                                {item?.name}
                              </Typography>
                              <Typography sx={{ fontSize: "13px" }}>
                                {item?.email}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      },
                    },
                    {
                      name: "total",
                      data: (value, item) => {
                        return (
                          <Typography
                            sx={{ color: "#7e8792", fontSize: "13px" }}
                          >
                            $02245
                          </Typography>
                        );
                      },
                    },
                    {
                      name: "status",
                      data: (value, item) => {
                        return (
                          <Box className="d-flex justify-content-center">
                            <Typography
                              className="fw-bold rounded-3 p-2"
                              sx={{
                                backgroundColor:
                                  value === "Non-Sub"
                                    ? "#fff0ea"
                                    : value === "inactive"
                                    ? "#eaf8ff"
                                    : "#e9faf7",
                                color:
                                  value === "Non-Sub"
                                    ? "#f86624"
                                    : value === "inactive"
                                    ? "#2bb2fe"
                                    : "#1a9882",
                                width: "fit-content",
                                fontSize: "13px",
                              }}
                            >
                              {value}
                            </Typography>
                          </Box>
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
                              <RiDeleteBin6Fill
                                style={{ color: "#7e8792" }}
                                size={25}
                              />
                            </IconButton>
                          </Box>
                        );
                      },
                    },
                  ]}
                />
                <Paginate />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
