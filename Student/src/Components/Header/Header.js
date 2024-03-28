import React, { useState, useEffect } from "react";
import { ProSidebar,Menu,MenuItem,SidebarHeader,SidebarFooter,SidebarContent } from "react-pro-sidebar";
import { FaList,FaQrcode,} from "react-icons/fa";
import { FiHome,FiLogOut,FiArrowLeftCircle,FiArrowRightCircle } from "react-icons/fi";
//import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import bigLogoImage from './kcalogo.jpeg';
import CreateQRCodeForm from "../QrCode/CreateQRCodeForm"; // Import the new component
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";

const Header = () => {
  const [menuCollapse, setMenuCollapse] = useState(false);
  const [attendanceSubMenu, setAttendanceSubMenu] = useState(false);
  const [showCreateQRCodeForm, setShowCreateQRCodeForm] = useState(false);
  // const [setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  const toggleCreateQRCodeForm = () => {
    setShowCreateQRCodeForm(!showCreateQRCodeForm);
  };
  
  const toggleAttendanceSubMenu = () => {
    setAttendanceSubMenu(!attendanceSubMenu);
  };

  return (
    <>
      <div id="header">
        <ProSidebar collapsed={menuCollapse}>
          <SidebarHeader>
            <div className="logotext">
              {menuCollapse ? (
                <p>Tranquil</p>
              ) : (
                <img src={bigLogoImage} alt="Big Logo" />
              )}
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {menuCollapse ? (
                <FiArrowRightCircle />
              ) : (
                <FiArrowLeftCircle />
              )}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              <MenuItem active={true} icon={<FiHome />}>
                Home
              </MenuItem>
              <MenuItem
                icon={<FaList />}
                onClick={toggleAttendanceSubMenu}
              >
                Check Attendance
                {attendanceSubMenu && (
                  <Menu>
                    {/* Add sub-menu items here */}
                    <MenuItem>Sub-menu 1</MenuItem>
                    <MenuItem>Sub-menu 2</MenuItem>
                  </Menu>
                )}
              </MenuItem>
              <MenuItem icon={<FaQrcode />} onClick={toggleCreateQRCodeForm}>
                Create QR-Code
              </MenuItem>
              <MenuItem icon={<BiCog />}>My Profile</MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu iconShape="square">
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      </div>
      {showCreateQRCodeForm && <CreateQRCodeForm />}
    </>
  );
};

export default Header;
