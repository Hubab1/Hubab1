import {
    css,
    injectGlobal
  } from 'emotion';
import styled from '@emotion/styled';


injectGlobal`
  a{
      text-decoration: none;
  }
  html,body{
    margin: auto;
    font-family: proxima-nova, sans-serif;
  }
`;

export const H1 = styled.div`
  margin: 20px 0;
  color: #454B57;
  font-size: 24px;
  line-height: 29px;
`

export const Subtitle = styled.small`
    color: #818797;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
`

export const SubtitleTwo = styled.small`
    color: rgba(38,48,91,1);
    font-size: 18px;
    font-weight: 500;
    line-height: 22px;
    text-align: center;
`

export const PageHeader = styled.div`
    color: #000000;
    margin: 15px 0;
    font-size: 24px;
    font-weight: bold;
    line-height: 29px;
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
    max-height: 650px;
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

export const Link = styled.a`
    color: #2B44FF;
    font-weight: 600;
    line-height: 17px;
`

export const CenterAlign = styled.div`
    text-align: center;
    margin-top: 200px;
`

export const BigText = styled.div`
    font-size: 50px;
    font-weight: bold;
`