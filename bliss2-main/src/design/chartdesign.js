import styled from 'styled-components';
import { FaDownload } from 'react-icons/fa';

export const Container = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column; /* Change to column to stack items vertically */
  align-items: center;
  padding: 15px;
  background-color: white;
  border-bottom: 2px solid black;
  position: relative; /* Ensures absolute positioning works */
`;
export const MenuBar = styled.div`
  background-color: #b22222;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Title = styled.h1`
  font-weight: bold;
`;

export const DownloadIcon = styled(FaDownload)`
  font-size: 20px;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-left: auto;

  &:hover {
    color: #FFD700; /* Gold */
  }
`;

export const ChartContainer = styled.div`
  width: 80%;
  margin: auto;
  padding: 20px;
`;
