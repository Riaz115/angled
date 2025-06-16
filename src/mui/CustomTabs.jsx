import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import User from '../assets/User.png';
import doc from '../assets/Vector.png'
import sit from '../assets/GearSix.png'
import { useLocation } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustomTabs = ({ tabs, panels, setcurrentTab,  setIsEditingDocument }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataParam = queryParams.get("activeTab");
  const [value, setValue] = React.useState(Number(dataParam));

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (setcurrentTab) {
      setcurrentTab(newValue);
    }
    setIsEditingDocument(false)
  };

  const icons = [
    <img src={User} alt="User Icon" style={{ height: "20px", width: "20px" }} />,
    <img src={doc} alt="Document Icon" style={{ height: "20px", width: "20px" }} />,
    <img src={sit} alt="Settings Icon" style={{ height: "20px", width: "20px" }} />,
  ];

  return (
    <div>
      <Box sx={{ width: "100%", marginLeft: "20px" }}>
        <Box>
          <Box className="d-md-flex justify-content-between mt-2">
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {tabs.map((tab, index) => (
                <Tab
                  label={tab}
                  icon={icons[index]}
                  iconPosition="start"
                  style={{
                    backgroundColor: value === index ? "white" : "transparent", // Selected tab background
                    color: value === index ? "#0a65cc" : "black",
                    fontWeight: value === index ? "bold" : "",
                    borderBottom: value === index ? '2px solid #0a65cc' : '',
                    fontSize: "14px",   
                    minHeight: "30px",      
                    lineHeight: "30px",
                  }}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </Box>
        </Box>
        {panels.map((panel, index) => (
          <CustomTabPanel
            className="border-top border-2"
            value={value}
            index={index}
            key={index}
          >
            {panel}
          </CustomTabPanel>
        ))}
      </Box>
    </div>
  );
};

export default CustomTabs;
