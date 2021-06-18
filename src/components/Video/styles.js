import styled, {css} from 'styled-components';

export const Container = styled.div`
    ${({show}) => css`
        video, div {
            /* background: rgba(0,0,0,0.2); */
            width: 100%;
            display: ${!!show ? "block" : "none"}
        }
    `}
`;
