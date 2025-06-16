import React, { useState } from "react";
import Navbar from "./Navbar";
import SideNav from "./SideNav";
function Header(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  return (
    <div>
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
      />
      <SideNav
        mobileOpen={mobileOpen}
        setMobileOpen={() => handleDrawerToggle()}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        type={props.type}
      />
    </div>
  );
}

export default Header;
