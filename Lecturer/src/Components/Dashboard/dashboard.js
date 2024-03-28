import React, { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { auth } from '../../firebase'; 
import { FaSignOutAlt } from 'react-icons/fa';
import { useUserContext } from '../../UserContext';
import ChatWithLecturers from './ChatWithLecturers';
import GroupChats from './groupChats';
import DocumentViewer from './DocumentViewer';
import StudentList from './StudentList';
import './Sidebar.css';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('list_students');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const user = auth.currentUser;
        const lecturer = JSON.parse(localStorage.getItem('lecturer'));
        if (lecturer) {    
          setUserData(lecturer);
        } else {
          console.error('No user signed in');
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    return () => {
      // Cleanup code if needed
    };
  }, []); 

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
      case 'list_students':
        return <StudentList userData={userData} />;
      case 'document_check':
        return <DocumentViewer userData={userData} />;
      case 'chat_with_lecturer':
        return <ChatWithLecturers userData={userData} />;
      case 'group_chats':
        return <GroupChats userData={userData} />;
      default:
        return null;
    }
  };

  const { firstname,
    lastname,
    name,
    email,
    lecturerId,
    levelofeducation} = userData;

  return (
    <div className="sidebar-layout">
      <ProSidebar className="pro-sidebar">
        <div className="sidebar-header">
          <h3>{name}</h3>
          <h4>{email}</h4>
        </div>
        <Menu iconShape="square">
          <MenuItem
            active={activeTab === 'list_students'}
            onClick={() => handleTabClick('list_students')}
          >
            Students List
          </MenuItem>

          <MenuItem
            active={activeTab === 'document_check'}
            onClick={() => handleTabClick('document_check')}
          >
            Check Documents
          </MenuItem>
          {/* <MenuItem
            active={activeTab === 'chat_with_lecturer'}
            onClick={() => handleTabClick('chat_with_lecturer')}
          >
            Chat with Students
          </MenuItem> */}
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