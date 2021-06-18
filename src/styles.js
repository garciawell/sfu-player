import styled, {css} from 'styled-components';

export const Box = styled.div`
  display: flex;
  align-items:center;
  span, div, button{
      margin: 10px;
  }
`;

export const ContainerScreen = styled.div`
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 3fr 1fr;
`;


export const Container = styled.div`
  max-width: 1200px;
  width: 100%; 
  margin: 0 auto
`;