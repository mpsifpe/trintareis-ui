import styled, { css } from 'styled-components';

const modalFooterModifiers = {
  isAButtonsRow: () => css`
    display: flex;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    justify-content: flex-end;
    column-gap: 0.8rem;
  `
};

const ModalFooter = styled.div`
  ${({ isButtonsRow }) => css`
    border-top: 0px solid #EAEAEA;
    padding: 1rem;
    opacity: 1;
    ${isButtonsRow && modalFooterModifiers.isAButtonsRow()}
  `}
`;

export default ModalFooter;