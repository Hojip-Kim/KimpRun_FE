import styled from "styled-components";

export const MarketSelectorContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  border-bottom: 1px solid #333333;
  border-radius: 8px 8px 0 0;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #007bff, #0056b3);
    border-radius: 8px 8px 0 0;
  }
`;

export const MarketSelectorGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 160px;
  position: relative;
`;

export const MarketSelectorLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #e0e0e0;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: "●";
    color: #007bff;
    font-size: 12px;
  }
`;

export const MarketSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #444444;
  border-radius: 8px;
  background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%);
  color: #e0e0e0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    transform: translateY(-1px);
    background: linear-gradient(145deg, #333333 0%, #2a2a2a 100%);
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2),
      0 4px 12px rgba(0, 123, 255, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    background: linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%);
    color: #666666;
    cursor: not-allowed;
    transform: none;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    border-color: #2a2a2a;
  }

  option {
    padding: 12px 16px;
    background: #2a2a2a;
    color: #e0e0e0;
    font-weight: 500;

    &:disabled {
      color: #666666;
      background: #1a1a1a;
      font-style: italic;
    }

    &:hover:not(:disabled) {
      background: linear-gradient(145deg, #0d47a1 0%, #1976d2 100%);
      color: #ffffff;
    }

    &[value="UPBIT"] {
      background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
      color: #ffffff;
    }

    &[value="BINANCE"] {
      background: linear-gradient(135deg, #f57c00 0%, #ffb74d 100%);
      color: #ffffff;
    }

    &[value="COINONE"] {
      background: linear-gradient(135deg, #388e3c 0%, #66bb6a 100%);
      color: #ffffff;
    }

    &[value="BITHUMB"] {
      background: linear-gradient(135deg, #d32f2f 0%, #ef5350 100%);
      color: #ffffff;
    }
  }
`;
