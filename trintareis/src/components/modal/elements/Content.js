import styled, { css } from 'styled-components';

const ModalContent = styled.div`
  ${({ theme }) => css`
    flex-grow: 1;
    padding: 0 0.8rem;
    overflow-y: scroll;
    /* Scroll */
    &::-webkit-scrollbar {
      width: 4px;
    }
    /* Scroll Handle */
    &::-webkit-scrollbar-thumb {
      background: #333;
    }
  `}
`;

export default ModalContent;