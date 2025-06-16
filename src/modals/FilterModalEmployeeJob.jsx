import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
} from "@mui/material";
function FilterModal(props) {
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");

  const handleFindClick = () => {
    const newFilter = {
      type: selectedJobType,
      shift: selectedShift,
      salary: selectedSalary,
    };

    props.onApplyFilter(newFilter);

    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="p-0"
      style={{ zIndex: 10020, backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <Modal.Header className="d-flex justify-content-between">
        <Modal.Title id="contained-modal-title-vcenter">
          Filter Jobs
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
            {/* Salary - Add Border for Medium Screens */}
            <div className="col-lg-5 col-md-6 col-sm-12 mb-3 border-left-custom border-left-medium">
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
            <div className="col-lg-4 col-md-6 col-sm-12 mb-3 border-left-custom d-flex flex-column">
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
    </Modal>
  );
}
export default FilterModal;
