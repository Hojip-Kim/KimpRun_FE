import React, { Dispatch, SetStateAction } from 'react';
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

export default Modal;
