import {
    css
} from 'emotion';
import styled from '@emotion/styled';

export const Subtitle = styled.small`
    color: #818797;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
`

export const formContent = css`
    padding: 10px;
    margin: auto;
    max-width: 500px;
`

export const TextReader = styled.div`
    text-align: left;
    background-color: rgba(238,238,238,0.4);
    max-height: 350px;
    overflow: auto;
    padding: 20px;
    color: #454B57;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
`

export const Bold = styled.span`
    font-weight: bold;
`

export const H1 = styled.h1`
    font-weight:600;
    font-size:23px;
    margin: 0;
`

export const H2 = styled.h2`
    font-weight: 400;
    font-size: 20px;
`

export const H3 = styled.h3`
    font-weight: 400;
    font-size: 18px;
`

export const P = styled.p`
    line-height: 30px;
    font-weight: 400;
    font-size: 16px;
    margin: 0;
`

export const GoBack = styled(P)`
    cursor: pointer;
`

export const CenterAlign = styled.div`
    text-align: center;
    margin-top: 200px;
`

export const BigText = styled.div`
    font-size: 50px;
    font-weight: bold;
` 