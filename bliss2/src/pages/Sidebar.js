import React from 'react';
import { Sidebar, Navbar, Title1, NavbarIcon, UserInfo, MenuItem } from '../design/homepagedesign';
import Logout from './logout';
import { FaHome, FaFilter, FaPlus, FaChartBar } from 'react-icons/fa';

const SidebarComponent = ({ isDashboardVisible, toggleDashboard, userName, userPosition, handleFilterModalOpen, handleAddMaterialsClick, handleChartsClick, handleHomeClick }) => {
  return (
    <Sidebar visible={isDashboardVisible}>
      <div>
        <Navbar>
          <Title1 visible={isDashboardVisible}>DASHBOARD</Title1>
          <NavbarIcon onClick={toggleDashboard} />
        </Navbar>
        <UserInfo visible={isDashboardVisible}>🔵 {userName} - {userPosition}</UserInfo>
        <MenuItem visible={isDashboardVisible} onClick={handleHomeClick}><FaHome /> {isDashboardVisible && 'HOME'}</MenuItem>
        <MenuItem visible={isDashboardVisible} onClick={handleFilterModalOpen}><FaFilter /> {isDashboardVisible && 'FILTER BY:'}</MenuItem>
        <MenuItem visible={isDashboardVisible} onClick={handleAddMaterialsClick}><FaPlus /> {isDashboardVisible && 'ADD MATERIALS'}</MenuItem>
        <MenuItem visible={isDashboardVisible} onClick={handleChartsClick}><FaChartBar /> {isDashboardVisible && 'GRAPHS'}</MenuItem>
        <Logout />
      </div>
    </Sidebar>
)
};

export default SidebarComponent;