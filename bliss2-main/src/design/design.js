import styled, { keyframes } from 'styled-components';


export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0; /* Changed background color */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  
`;

export const LoginBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
  width: 450px; /* Fixed size */
  text-align: center;
  animation: ${fadeIn} 0.8s ease-in-out;
  border: 1px solid #ccc;
`;

export const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 28px;
  font-weight: bold;
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  text-align: left;
  font-weight: bold;
  margin: 12px 0 6px;
  font-size: 14px;
  color: #555;
`;

export const Input = styled.input`
  width: 90%; /* Fixed size */
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.3s ease-in-out;
  margin-right: 15px;

  &:focus {
    border-color: #2575fc;
    outline: none;
  }
`;

export const Button = styled.button`
  width: 80%; /* Fixed size */
  padding: 12px;
  background:rgba(11, 189, 25, 0.75);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 15px;
  margin-right: 15px;
  transition: all 0.3s ease-in-out;

  &:hover {
    background:rgb(49, 228, 13);
    transform: scale(1.05);
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 10px;
`;

export const Link = styled.a`
  display: block;
  color: #2575fc;
  margin-top: 15px;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;