import React, { Dispatch, SetStateAction } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Canvas, Container, Wrapper } from './style';

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

  const modalContent = (
    <>
      <Canvas onClick={disableModal} />
      <Container 
        width={width} 
        height={height}
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
      >
        <div className="exit-wrapper" onClick={disableModal}>
          닫기
        </div>
        <Wrapper>{element}</Wrapper>
      </Container>
    </>
  );

  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default Modal;
