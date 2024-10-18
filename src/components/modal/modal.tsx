import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

interface ModalProps {
  width: number;
  height: number;
  element: JSX.Element;
  setModal: Dispatch<SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ width, height, element, setModal }) => {
  const disableModal = () => {
    // 모달 상태변경 함수
    setModal(false);
  };

  return (
    <>
      <Container width={width} height={height}>
        <div className="exit-wrapper" onClick={disableModal}>
          닫기
        </div>
        <Wrapper>{element}</Wrapper>
      </Container>
      <Canvas onClick={disableModal} />
    </>
  );
};

const Container = styled.div<{ width: number; height: number }>`
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

const Canvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const Wrapper = styled.div`
  background-color: transparent;
`;

export default Modal;
