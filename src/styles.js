import styled, {css} from 'styled-components';

export const Box = styled.div`
  display: flex;
  align-items:center;
  span, div, button{
      margin: 10px;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto
`;


export const ContainerScreen = styled.div`
    ${({shared}) => shared && css`
      display: grid;
      grid-gap: 10px;
      grid-template-columns: 4fr 1fr;
    `}
`;
