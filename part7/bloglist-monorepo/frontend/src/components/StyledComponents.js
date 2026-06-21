// src/components/StyledComponents.js
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #eff1f5;
    color: #4c4f69;
  }
`;

// Layout containers
export const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
`;

export const Nav = styled.nav`
  background-color: #7287fd;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 60px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  margin-bottom: 30px;
  border-radius: 0 0 8px 8px;

  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  span {
    color: #e0e0e0;
    margin-left: auto;
    font-size: 0.9rem;
  }
`;

// Forms & Inputs
export const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 450px;
  margin: 20px 0;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    color: #555;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #3f51b5;
    }
  }
`;

// Buttons
export const Button = styled.button`
  background-color: ${(props) =>
    props.danger ? "#dc3545" : props.secondary ? "#6c757d" : "#3f51b5"};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Dynamic Contextual Notifications
export const StyledNotification = styled.div`
  padding: 12px 20px;
  margin: 15px 0;
  border-radius: 4px;
  font-weight: 500;
  border-left: 5px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  background-color: ${(props) =>
    props.type === "error" ? "#fde8e8" : "#eafaf1"};
  color: ${(props) => (props.type === "error" ? "#9b1c1c" : "#14532d")};
  border-left-color: ${(props) =>
    props.type === "error" ? "#de350b" : "#00875a"};
`;

// Lists & Cards
export const BlogItemCard = styled.div`
  background: white;
  padding: 16px 20px;
  margin: 10px 0;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  a {
    color: #3f51b5;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

export const BlogDetailWrapper = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #3f51b5;
  margin-top: 20px;

  h2 {
    margin-top: 0;
    color: #222;
  }

  p {
    margin: 12px 0;
    font-size: 1.05rem;
    color: #444;
  }
`;
