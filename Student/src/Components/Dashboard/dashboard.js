import React, { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { auth } from '../../firebase'; // Adjust the path accordingly
import { FaSignOutAlt } from 'react-icons/fa';
import { useUserContext } from '../../UserContext';
import ChatWithLecturers from './ChatWithLecturers'; // Import the ChatWithLecturers component here
import GroupChats from './groupChats';
import Chatbot from './ChatBot';
import UploadDocument from './UploadDocument'
import './Sidebar.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('upload_document'); // Default active tab
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUserContext(); // Assuming setUser is provided by UserContext

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const user = auth.currentUser;
        const student = JSON.parse(localStorage.getItem('student'));
        if (student) {
          // User is signed in
          // const student = JSON.parse(localStorage.getItem('student'));
          setUserData(student);
        } else {
          // No user signed in, navigate to login page
          console.error('No user signed in');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    // Clean up function
    return () => {
      // Cleanup code if needed
    };
  }, []); // Empty dependency array ensures the effect runs only once

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    // Implement logout functionality here
  };

  if (!userData) {
    return null; // Or loading indicator
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload_document':
        return <UploadDocument userData={userData} />;
      case 'chat_with_lecturer':
        return <ChatWithLecturers userData={userData} />;
      case 'group_chats':
        return <GroupChats userData={userData} />;
      case 'ai_chats':
        return <Chatbot userData={userData} />;  
      default:
        return null;
    }
  };

  const { username, regno } = userData;

  return (
    <div className="sidebar-layout">
      <ProSidebar className="pro-sidebar">
        <div className="sidebar-header">
          <h3>{username}</h3>
          <h4>{regno}</h4>
        </div>
        <Menu iconShape="square">
          <MenuItem
            active={activeTab === 'upload_document'}
            onClick={() => handleTabClick('upload_document')}
          >
            Upload Document
          </MenuItem>
          <MenuItem
            active={activeTab === 'chat_with_lecturer'}
            onClick={() => handleTabClick('chat_with_lecturer')}
          >
            Chat with Lecturer
          </MenuItem>
          <MenuItem
            active={activeTab === 'ai_chats'}
            onClick={() => handleTabClick('ai_chats')}
          >
            EduConnectBot
          </MenuItem>
          <MenuItem
            active={activeTab === 'group_chats'}
            onClick={() => handleTabClick('group_chats')}
          >
            Group Chats
          </MenuItem>
        </Menu>
        <div className="sidebar-footer">
          <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
            Logout
          </MenuItem>
        </div>
      </ProSidebar>
      <div className="main-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Sidebar;