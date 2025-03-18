import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Container, Header, Title, DownloadIcon, ChartContainer } from '../design/chartdesign';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { MenuBar } from '../design/homepagedesign';
import SidebarComponent from './Sidebar'; // Import SidebarComponent
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const Charts = ({ handleDownloadClick }) => {
  const [chartData, setChartData] = useState(null);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const navigate = useNavigate(); // Define navigate
  const location = useLocation(); // Define location
  const { userName, userPosition } = location.state || { userName: 'User', userPosition: 'Position' }; // Retrieve userName and userPosition

  const toggleDashboard = () => {
    setIsDashboardVisible(prevState => !prevState);
  };

  useEffect(() => {
    axios.get("https://vynceianoani.helioho.st/bliss/graph.php")
      .then((response) => {
        const data = response.data;
        const monthlyData = {};

        data.forEach(item => {
          const date = new Date(item.date_received);
          const month = date.toLocaleString('en-US', { month: 'long' });

          if (!monthlyData[month]) {
            monthlyData[month] = 0;
          }
          monthlyData[month] += parseInt(item.quantity, 10); // Ensure quantity is an integer
        });

        const months = Object.keys(monthlyData);
        const counts = Object.values(monthlyData);

        setChartData({
          labels: months,
          datasets: [{
            label: "Count per Month",
            backgroundColor: "#1E90FF",
            data: counts,
          }],
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <Container style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SidebarComponent
        isDashboardVisible={isDashboardVisible}
        toggleDashboard={toggleDashboard}
        userName={userName}
        userPosition={userPosition}
        handleFilterModalOpen={null}
        handleAddMaterialsClick={null}
        handleChartsClick={() => navigate('/chart')}
        handleHomeClick={() => navigate('/user')}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header>
          <Title>DIGITAL ACCESSION RECORDS GRAPH</Title>
        </Header>
        <MenuBar>
          <DownloadIcon onClick={handleDownloadClick} />
        </MenuBar>
        <ChartContainer style={{ flex: 1 }}>
          <Bar data={chartData} options={{ responsive: true }} />
        </ChartContainer>
      </div>
    </Container>
  );
};

export default Charts;