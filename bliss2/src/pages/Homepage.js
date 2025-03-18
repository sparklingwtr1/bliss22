import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddModal from '../component/addModal';
import ConfirmationModal from '../component/confirmationModal';
import FilterModal from '../component/FilterModal';
import SidebarComponent from './Sidebar';
import Charts from './Charts';
import { Container, Header, HeaderRight, Title, SearchBox, HelpText, MenuBar, TableContainer, Table, Th, Td, RecommendationItem, RecommendationModal, DownloadIcon } from "../design/homepagedesign";
import Chatbot from '../component/Chatbot';

function UserPage() {
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [userName, setUserName] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Available');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'NUMBER', 'DATE ACCESSION', 'MATERIAL CATEGORY', 'AUTHOR', 'TITLE OF BOOK', 'EDITION', 'VOLUME', 'PAGES', 'SOURCE OF FUND', 'COST', 'PUBLISHER', 'YEAR', 'BARCODE', 'PROGRAM', 'REMARKS'
  ]);
  const [dateRange, setDateRange] = useState({ from: '', until: '' });
  const [showCharts, setShowCharts] = useState(false); // New state for showing charts
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from PHP API
    const fetchData = async () => {
      const response = await fetch('https://vynceianoani.helioho.st/bliss/getbook.php');
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setTableData(sortedData);
      setFilteredData(sortedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Lock the back button
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/user');
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'Available') {
      const filtered = tableData.filter((row) => row.remarks === 'Available');
      setFilteredData(filtered);
    }
  }, [tableData, activeTab]);

  useEffect(() => {
    // Fetch user details from PHP API
    const fetchUserDetails = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        const response = await fetch('https://vynceianoani.helioho.st/bliss/getInfo.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUserName(data.name);
          setUserPosition(data.position);
        } else {
          console.error(data.error || 'Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleAddMaterialsClick = () => {
    setShowModal(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newData = {
      id: formData.get('id'),
      dateReceived: formData.get('dateReceived'),
      class: formData.get('class'),
      author: formData.get('author'),
      title: formData.get('title'),
      edition: formData.get('edition'),
      volume: formData.get('volume'),
      pages: formData.get('pages'),
      recordOfSource: formData.get('recordOfSource'),
      costPrice: formData.get('costPrice'),
      publisher: formData.get('publisher'),
      year: formData.get('year'),
      barcode: formData.get('barcode'),
      department: formData.get('department'),
      remarks: formData.get('remarks'),
      quantity: formData.get('quantity')
    };

    setFormData(newData);
    setIsModalOpen(true);
    setShowModal(false);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = tableData.filter((row) =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
    setShowRecommendations(value.length > 0);
  };

  const handleRecommendationClick = (recommendation) => {
    setSearchTerm(recommendation.title);
    setShowRecommendations(false);
  };

  const toggleDashboard = () => {
    setIsDashboardVisible(prevState => !prevState);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    // Send data to PHP API
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    const response = await fetch('https://vynceianoani.helioho.st/bliss/addbook.php', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      const updatedTableData = [...tableData, formData];
      const sortedData = updatedTableData.sort((a, b) => a.id - b.id);
      setTableData(sortedData);
      setFilteredData(sortedData);
      window.location.reload(); // Refresh the screen
    } else {
      console.error('Failed to add data');
    }
  };

  const handleDownloadClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
  };

  const handlePasswordSubmit = () => {
    if (password === 'sample') { // Replace 'your_password' with the actual password
      generatePDF();
      handlePasswordModalClose();
    } else {
      alert('Incorrect password');
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('table');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: 'legal'
      });
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Calculate the aspect ratio of the image
      const aspectRatio = imgProps.width / imgProps.height;
  
      // Calculate the width and height of the image to fit within the PDF dimensions
      let width = pdfWidth - 2 * 0.5; // Subtract padding
      let height = width / aspectRatio;
  
      // If the height is too tall, adjust the width and height
      if (height > pdfHeight - 2 * 0.5) {
        height = pdfHeight - 2 * 0.5;
        width = height * aspectRatio;
      }
  
      // Center the image within the PDF
      const x = (pdfWidth - width) / 2;
      const y = (pdfHeight - height) / 2;
  
      pdf.addImage(imgData, 'PNG', x, y, width, height);
      pdf.save('Digital_Accession_Records.pdf');
    });
  };
  
  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const handleDateRangeChange = (from, until) => {
    setDateRange({ from, until });
    const filtered = tableData.filter((row) => {
      const date = new Date(row.date_received);
      const fromDate = new Date(from);
      const untilDate = new Date(until);
      return (!from || date >= fromDate) && (!until || date <= untilDate);
    });
    setFilteredData(filtered);
  };

  const handleTabClick = (event) => {
    const tab = event.target.value;
    setActiveTab(tab);
    if (tab === 'Remarks') {
      setFilteredData(tableData);
    } else {
      const filtered = tableData.filter((row) => row.remarks === tab);
      setFilteredData(filtered);
    }
  };

  const handleChartsClick = () => {
    navigate('/chart', { state: { userName, userPosition } });
  };

  const handleHomeClick = () => {
    setShowCharts(false);
  };

  const columns = [
    'NUMBER', 'DATE ACCESSION', 'MATERIAL CATEGORY', 'AUTHOR', 'TITLE OF BOOK', 'EDITION', 'VOLUME', 'PAGES', 'SOURCE OF FUND', 'COST', 'PUBLISHER', 'YEAR', 'BARCODE', 'PROGRAM', 'REMARKS', 'QUANTITY'
  ];

  return (
    <Container>
      <SidebarComponent
        isDashboardVisible={isDashboardVisible}
        toggleDashboard={toggleDashboard}
        userName={userName}
        userPosition={userPosition}
        handleFilterModalOpen={showCharts ? null : handleFilterModalOpen} // Disable when showing charts
        handleAddMaterialsClick={showCharts ? null : handleAddMaterialsClick} // Disable when showing charts
        handleChartsClick={handleChartsClick}
        handleHomeClick={handleHomeClick}
      />
      {showCharts ? (
        <Charts
          handleDownloadClick={handleDownloadClick}
        />
      ) : (
        <TableContainer id="table-container">
          <Header>
            <Title>DIGITAL ACCESSION RECORDS</Title>
            <HeaderRight>
              <SearchBox
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ marginRight: '10px' }}
              />
              {showRecommendations && (
                <RecommendationModal>
                  {filteredData.map((item, index) => (
                    <RecommendationItem key={index} onClick={() => handleRecommendationClick(item)}>
                      {item.title} by {item.author}
                    </RecommendationItem>
                  ))}
                </RecommendationModal>
              )}
              <HelpText>Help</HelpText>
            </HeaderRight>
          </Header>
          <MenuBar>
            <select value={activeTab} onChange={handleTabClick} style={{ marginRight: '10px' }}>
              <option value="Remarks">All</option>
              <option value="Lost">Lost</option>
              <option value="Donate">Donate</option>
              <option value="Damage">Damage</option>
              <option value="Available">Available</option>
            </select>
            <DownloadIcon onClick={handleDownloadClick} />
          </MenuBar>
          <Table id="table">
            <thead>
              <tr>
                {columns.map((column) => (
                  selectedColumns.includes(column) && <Th key={column}>{column}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
    {filteredData.map((row, index) => (
      <tr key={index}>
        {selectedColumns.includes('NUMBER') && <Td>{row.id}</Td>}
        {selectedColumns.includes('DATE ACCESSION') && <Td>{row.date_received}</Td>} {/* Changed to DATE ACCESSION */}
        {selectedColumns.includes('MATERIAL CATEGORY') && <Td>{row.class}</Td>} {/* Changed to MATERIAL CATEGORY */}
        {selectedColumns.includes('AUTHOR') && <Td>{row.author}</Td>}
        {selectedColumns.includes('TITLE OF BOOK') && <Td>{row.title}</Td>}
        {selectedColumns.includes('EDITION') && <Td>{row.edition}</Td>}
        {selectedColumns.includes('VOLUME') && <Td>{row.volume}</Td>}
        {selectedColumns.includes('PAGES') && <Td>{row.pages}</Td>}
        {selectedColumns.includes('SOURCE OF FUND') && <Td>{row.record_of_source}</Td>}
        {selectedColumns.includes('COST') && <Td>{row.cost_price}</Td>}
        {selectedColumns.includes('PUBLISHER') && <Td>{row.publisher}</Td>}
        {selectedColumns.includes('YEAR') && <Td>{row.year}</Td>}
        {selectedColumns.includes('BARCODE') && <Td>{row.barcode}</Td>}
        {selectedColumns.includes('PROGRAM') && <Td>{row.department}</Td>} {/* Changed to PROGRAM */}
        {selectedColumns.includes('REMARKS') && <Td>{row.remarks}</Td>}
      </tr>
    ))}
  </tbody>
          </Table>
        </TableContainer>
      )}
      <AddModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleFormSubmit} />
      <ConfirmationModal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm}>
        <p><strong>Date Received:</strong> {formData.dateReceived}</p>
        <p><strong>Class:</strong> {formData.class}</p>
        <p><strong>Author:</strong> {formData.author}</p>
        <p><strong>Title:</strong> {formData.title}</p>
        <p><strong>Edition:</strong> {formData.edition}</p>
        <p><strong>Volume:</strong> {formData.volume}</p>
        <p><strong>Pages:</strong> {formData.pages}</p>
        <p><strong>Record of Source:</strong> {formData.recordOfSource}</p>
        <p><strong>Cost Price:</strong> {formData.costPrice}</p>
        <p><strong>Publisher:</strong> {formData.publisher}</p>
        <p><strong>Year:</strong> {formData.year}</p>
        <p><strong>Barcode:</strong> {formData.barcode}</p>
        <p><strong>Department:</strong> {formData.department}</p>
        <p><strong>Remarks:</strong> {formData.remarks}</p>
        <p><strong>Quantity:</strong> {formData.quantity}</p>
      </ConfirmationModal>
      <ConfirmationModal isOpen={isPasswordModalOpen} onClose={handlePasswordModalClose} onConfirm={handlePasswordSubmit}>
        <p><strong>Enter Password to Download PDF:</strong></p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '16px', transition: 'border-color 0.3s' }}
          required
        />
      </ConfirmationModal>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterModalClose}
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnChange={handleColumnChange}
        onDateRangeChange={handleDateRangeChange}
      />
      <Chatbot />
    </Container>
  );
}

export default UserPage;