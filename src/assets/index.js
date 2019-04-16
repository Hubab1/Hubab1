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
    // max-width: 38rem;
    // padding: 2rem;
    margin: auto;
    font-family: sans-serif;
  }
`;

export const page = css`
  text-align: center;
`


export const Banner = styled.div`
  height: 100px;
  box-shadow: 0 2px 4px 0 rgba(177,181,189,0.4);
  padding-top: 30px;
  padding-bottom: 30px;
  font-size: 30px;
  text-align: center;
`

export const H1 = styled.div`
  margin: 20px;
  color: #454B57;
  font-size: 24px;
  line-height: 29px;
  text-align: center;
`

export const TextReader = styled.div`
  text-align: left;
  background-color: rgba(238,238,238,0.4);
  max-height: 650px;
  overflow: auto;
  margin: 20px;
  padding: 20px;
  color: #454B57;
  font-size: 14px;
  font-weight: 500;
  line-height: 17px;
`

export const Bold = styled.span`
  font-weight: bold;
`

export const BlueButton = styled.button`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    line-height: 17px;
    color: white;
    border-radius: 2px;
    background-color: #2B44FF;
    box-shadow: 0 2px 4px 0 rgba(177,181,189,0.4);

`

export const Link = styled.a`
  color: #2B44FF;
  font-weight: 600;
  line-height: 17px;
`