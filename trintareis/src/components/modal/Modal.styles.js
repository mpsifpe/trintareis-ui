import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.1s ease-in;
`;

const wrapperModifiers = {
  xsmall: () => css`
    width: 420px;
    height: 260px;
  `,

  small: () => css`
    width: 500px;
    height: 420px;
  `,

  medium: () => css`
    width: 700px;
    height: 540px;
  `,

  large: () => css`
    width: 1100px;
    height: 680px;
  `
};

export const Wrapper = styled.div`
  ${({ size }) => css`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #FAFAFA;
    color: #333;
    position: relative;
    z-index: 10;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    ${!!size && wrapperModifiers[size]()}
    animation: ${fadeInUp} 0.2s ease-in;
    opacity: 1;
  `}
`;

export const Header = styled.div`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;
    position: relative;
    opacity: 1;
    .title {
      font-size: 1.5rem;
      color: #333;
      font-weight: 700;
    }
    .close-button {
      position: absolute;
      right: 0.8rem;
      border-radius: 50%;
      width: 1.8rem;
      height: 1.8rem;
      padding-bottom: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      // inner icon
      svg {
        width: 2rem;
      }
      // button inner content (<span />)
      span {
        display: none;
      }
    }
`;