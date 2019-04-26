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
    font-family: sans-serif;
  }
`;

export const page = css`
  text-align: center;
  max-width: 900px;
  margin: auto;
  padding-bottom: 25px;
`

export const subPage = css`
    padding: 45px 20px;
`

export const Disclaimer = styled.div`
    color: #454B57;
    font-size: 14px;
    padding: 25px;
    line-height: 17px;
    text-align: center;
`

export const agentBlock = css`
    padding: 25px;
    line-height: 18px;
    box-shadow: 0 2px 4px 0 rgba(177,181,189,0.4);
`

export const agentTitle = css`
    line-height: 25px;
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
  margin: 20px 0;
  color: #454B57;
  font-size: 24px;
  line-height: 29px;
`

export const PageHeader = styled.div`
    color: #000000;
    margin: 15px 0;
    font-size: 24px;
    font-weight: bold;
    line-height: 29px;
    text-align: center;
`

export const Subtitle = styled.small`
    color: #818797;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
`

// export const Subtitle = styled.small`
//     color: #818797;
// `

export const loginContent = css`
    padding: 35px;
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

 export const BackgroundImage = styled.div( props => ({
     position: 'absolute',
     top: 0,
     left: 0,
     width: '100%',
     height: '100%',
     backgroundPosition: 'center',
     backgroundSize: 'cover',
     zIndex: -5,
     opacity: .5,
     backgroundImage: `url(${props.url})`,
 }))
