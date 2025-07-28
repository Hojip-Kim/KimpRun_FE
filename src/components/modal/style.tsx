import styled from 'styled-components';
export const Container = styled.div<{ width: number; height: number }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: 8px;
  background-color: black;
  border-radius: 8px;
  z-index: 2000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  color: white;

  .exit-wrapper {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 14px;
    font-weight: 800;
    background-color: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Canvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

export const Wrapper = styled.div`
  background-color: transparent;
`;
