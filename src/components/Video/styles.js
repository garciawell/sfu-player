import styled, {css} from 'styled-components';

export const Container = styled.div`
    ${({show}) => css`
        video {
            /* background: rgba(0,0,0,0.2); */
            width: 100%;
            height: 100%;
            display: ${!!show ? "block" : "none"}
        }
    `}
`;
