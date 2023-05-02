import styled, { css } from 'styled-components';

const ModalContent = styled.div`
  ${({ theme }) => css`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    flex-grow: 1;
    padding: 0 0.8rem;
    opacity: 1;
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