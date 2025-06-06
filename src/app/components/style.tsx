import styled from 'styled-components';

export const MainContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: #121212;
  color: #ffffff;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 150px;
  gap: 20px;
  justify-content: center;
`;

export const LeftSideContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 130px);
  flex: 3;
  min-width: 400px;
  max-width: 600px;
  gap: 20px;
  margin: 20px 0 20px 20px;
`;

export const ChartContainer = styled.div`
  flex: 1;
  min-height: 300px;
  max-height: 30%;

  #chart {
    justify-content: center;
    background-color: #131722;
    align-items: left;
    height: 100%;
    width: 100%;
    border: 1px solid #333333;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const RowContainer = styled.div`
  flex: 4.5;
  min-width: 600px;
  max-width: 900px;
  margin: 20px 0;
  padding: 20px;
  background-color: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 150px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChatContainer = styled.div`
  flex: 2.5;
  min-width: 300px;
  max-width: 400px;
  background-color: #1e1e1e;
  margin: 20px 20px 20px 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
