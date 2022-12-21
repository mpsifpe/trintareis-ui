import styled, { css } from 'styled-components';

const modalFooterModifiers = {
  isAButtonsRow: () => css`
    display: flex;
    justify-content: flex-end;
    column-gap: 0.8rem;
  `
};

const ModalFooter = styled.div`
  ${({ isButtonsRow }) => css`
    border-top: 1px solid #EAEAEA;
    padding: 0.8rem;
    ${isButtonsRow && modalFooterModifiers.isAButtonsRow()}
  `}
`;

export default ModalFooter;