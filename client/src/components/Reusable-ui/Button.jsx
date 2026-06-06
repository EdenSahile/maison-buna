import styled from "styled-components";
import theme from "../../theme";

export const PrimaryButton = styled.button`
  background: ${theme.brown};
  color: ${theme.white};
  border: none;
  padding: 16px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow:
    0 1px 0 rgba(0, 0, 0, 0.04),
    0 4px 14px rgba(61, 40, 23, 0.18);

  &:hover {
    background: ${theme.dark};
    transform: translateY(-1px);
    box-shadow:
      0 1px 0 rgba(0, 0, 0, 0.04),
      0 8px 20px rgba(61, 40, 23, 0.28);
  }
  &:active {
    transform: translateY(0);
  }
  &:focus-visible {
    outline: 2px solid ${theme.accent};
    outline-offset: 3px;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  svg {
    transition: transform 0.25s ease;
  }
  &:hover svg {
    transform: translateX(3px);
  }
`;

export const GhostButton = styled.button`
  background: transparent;
  color: ${theme.brown};
  border: 1px solid ${theme.line};
  padding: 12px 24px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 13px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.creamSoft};
    border-color: ${theme.sand};
  }
  &:focus-visible {
    outline: 2px solid ${theme.accent};
    outline-offset: 3px;
  }
`;
