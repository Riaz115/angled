import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from "@mui/material";
import apiClient from "../api/apiClient";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { Loader } from "../components/Loader/loader";

function FilterModalEmployer(props) {
  const [selectedRole, setSelectedRole] = React.useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [departments, setDepartment] = useState();
  const [roles, setRole] = useState();
  const user = useSelector(selectUser);

  const getdepartment = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/facility/api/department/`);
      if (response.ok) {
        setDepartment(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of getdepartment data response");
      setLoading(false);
    }
  };

  const getrole = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/role/`);
      if (response.ok) {
        setRole(response?.data?.results);
      }
      setLoading(false);
    } catch (error) {
      console.log(error, "this is error of getrole data response");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getdepartment();
      getrole();
    }
  }, [user]);

  const handleFindClick = () => {
    const newFilter = {
      job_role: selectedRole,
      job_type: selectedJobType,
      job_shift: selectedShift,
      job_department: selectedDepartment,
      job_salary: selectedSalary,
    };

    props.onApplyFilter(newFilter);

    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="p-0"
      style={{ zIndex: 10020, backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <Modal.Header className="d-flex justify-content-between">
        <Modal.Title id="contained-modal-title-vcenter">
          Advance Filters
        </Modal.Title>
        <Button
          onClick={handleFindClick}
          sx={{
            textTransform: "none",
            backgroundColor: "#0a65cc",
            "&:hover": {
              backgroundColor: "#084a9e",
            },
          }}
          className="py-3 px-5 text-white d-none d-sm-block"
        >
          Find
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="container bg-white">
          <div className="row">
            {/* Specialties */}
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
              <FormLabel
                component="legend"
                style={{
                  color: "#191F33",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Specialities
              </FormLabel>
              <RadioGroup
                name="specialities"
                value={selectedRole} // State for selected role
                onChange={(e) => setSelectedRole(e.target.value)} // Update state on selection
              >
                {roles?.map((role) => (
                  <FormControlLabel
                    key={role?.id}
                    value={role?.name}
                    control={<Radio />}
                    label={role.name}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: "#191F33", // Default label color
                      },
                      "& .Mui-checked + .MuiFormControlLabel-label": {
                        color: "#004fff", // Custom label color when radio is selected
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </div>

            {/* Salary - Add Border for Medium Screens */}
            <div className="col-lg-3 col-md-6 col-sm-12 mb-3 border-left-custom border-left-medium">
              <FormLabel
                component="legend"
                style={{
                  color: "#191F33",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Salary
              </FormLabel>
              <RadioGroup
                name="salary"
                value={selectedSalary} // Bind value to the selectedSalary state
                onChange={(e) => setSelectedSalary(e.target.value)} // Update state on selection
              >
                <FormControlLabel
                  value="$50 - $1000"
                  control={<Radio />}
                  label="$50 - $1000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$1000 - $2000"
                  control={<Radio />}
                  label="$1000 - $2000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$3000 - $4000"
                  control={<Radio />}
                  label="$3000 - $4000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$4000 - $6000"
                  control={<Radio />}
                  label="$4000 - $6000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$6000 - $8000"
                  control={<Radio />}
                  label="$6000 - $8000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$8000 - $10000"
                  control={<Radio />}
                  label="$8000 - $10000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="$10000 - $15000"
                  control={<Radio />}
                  label="$10000 - $15000"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
              </RadioGroup>
            </div>
            {/* Job Type - Add Border for Medium Screens */}
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3 border-left-custom">
              <FormLabel
                component="legend"
                style={{
                  color: "#191F33",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Job Type
              </FormLabel>
              <RadioGroup
                value={selectedJobType} // State to track the selected value
                onChange={(e) => setSelectedJobType(e.target.value)} // Update state on selection
                sx={{
                  "& .MuiFormControlLabel-label": {
                    color: "#191F33", // Default label color
                  },
                  "& .Mui-checked + .MuiFormControlLabel-label": {
                    color: "#004fff", // Custom label color when selected
                  },
                }}
              >
                <FormControlLabel
                  value="DH"
                  control={<Radio />}
                  label="Direct Hire"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when selected
                    },
                  }}
                />
                <FormControlLabel
                  value="C"
                  control={<Radio />}
                  label="Contract"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when selected
                    },
                  }}
                />
                <FormControlLabel
                  value="D"
                  control={<Radio />}
                  label="Diem"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when selected
                    },
                  }}
                />
              </RadioGroup>
            </div>

            {/* Department */}
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3 border-left-custom border-left-medium">
              <FormLabel
                component="legend"
                style={{
                  color: "#191F33",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Department
              </FormLabel>
              <RadioGroup
                name="department"
                value={selectedDepartment} // State for the selected department
                onChange={(e) => setSelectedDepartment(e.target.value)} // Update state on selection
              >
                {departments?.map((department) => (
                  <FormControlLabel
                    key={department?.id}
                    value={department?.name}
                    control={<Radio />}
                    label={department.name}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        color: "#191F33", // Default label color
                      },
                      "& .Mui-checked + .MuiFormControlLabel-label": {
                        color: "#004fff", // Custom label color when selected
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </div>

            {/* Shift */}
            <div className="col-lg-2 col-md-6 col-sm-12 mb-3 border-left-custom">
              <FormLabel
                component="legend"
                style={{
                  color: "#191F33",
                  fontFamily: "Poppins",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                Shift
              </FormLabel>
              <RadioGroup
                name="shift"
                value={selectedShift} // State to track the selected value
                onChange={(e) => setSelectedShift(e.target.value)} // Update state on selection
              >
                <FormControlLabel
                  value="A"
                  control={<Radio />}
                  label="Morning"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="P"
                  control={<Radio />}
                  label="Evening"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
                <FormControlLabel
                  value="N"
                  control={<Radio />}
                  label="Night"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      color: "#191F33", // Default label color
                    },
                    "& .Mui-checked + .MuiFormControlLabel-label": {
                      color: "#004fff", // Custom label color when radio is selected
                    },
                  }}
                />
              </RadioGroup>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{ borderTop: "none" }}
        className="d-flex align-items-center gap-3"
      >
        <Button
          onClick={props.onHide}
          sx={{
            textTransform: "none",
            backgroundColor: "#0a65cc",
            "&:hover": {
              backgroundColor: "#084a9e",
            },
          }}
          className="py-3 px-5 text-white d-block d-sm-none"
        >
          Close
        </Button>
        <Button
          onClick={handleFindClick}
          sx={{
            textTransform: "none",
            backgroundColor: "#0a65cc",
            "&:hover": {
              backgroundColor: "#084a9e",
            },
          }}
          className="py-3 px-5 text-white d-block d-sm-none"
        >
          Find
        </Button>
      </Modal.Footer>
      <Loader loading={loading} />
    </Modal>
  );
}
export default FilterModalEmployer;
