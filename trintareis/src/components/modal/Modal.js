import * as S from './Modal.styles';
import ModalContent from './elements/Content';
import ModalFooter from './elements/Footer';
import { useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';
import React from 'react';

import { AiOutlineClose } from "react-icons/ai";

/**
 * Modal component
 */
const Modal = ({
  title = 'Be careful',
  size = 'medium',
  isOpen = false,
  children,
  onClose
}) => {
  const modalContentWrapperRef = useRef(null);

  useOutsideClick(modalContentWrapperRef, onClose);

  return isOpen ? (
    <S.Backdrop>
      <S.Wrapper
        size={size}
        ref={modalContentWrapperRef}
        aria-label={`Modal with title "${title}"`}
      >
        <S.Header>
          <h3 className='title'>{title}</h3>
          
          <AiOutlineClose
            className='close-button'
            aria-label='Close modal'
            onClick={onClose}
          />

          {/* <button
            className='close-button'
            aria-label='Close modal'
            onClick={onClose}
          >Fechar</button> */}

          {/* <Button
            className='close-button'
            icon={<CloseIcon />}
            aria-label='Close modal'
            onClick={onClose}
          /> */}
        </S.Header>

        {children}
      </S.Wrapper>
    </S.Backdrop>
  ) : null;
};

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;