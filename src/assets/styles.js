import {
    css
} from 'emotion';
import styled from '@emotion/styled';

export const formContent = css`
    padding: 10px;
    margin: auto;
    max-width: 500px;
`

export const ErrorDetail = styled.div`
    color: #f44336;
    text-align: left;
    font-size: 0.75rem;
    margin: 8px 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1em;
`

export const Logo = styled.img`
    max-width: 120px;
    max-height: 50px;
`;

export const Bold = styled.span`
    font-weight: bold;
`

export const H1 = styled.h1`
    font-weight:600;
    font-size:23px;
    margin: 0 auto;
`

export const H2 = styled.h2`
    font-weight: 400;
    font-size: 20px;
`

export const H3 = styled.h3`
    font-weight: 400;
    line-height: 22px;
    font-size: 18px;
    color: #454B57;
    margin: 0;
`

export const P = styled.p(props => ({
    fontWeight: props.bold ? 600 : 400,
    fontSize: props.fontSize ? props.fontSize : 16,
    margin: props.margin ? props.margin : 0,
    marginTop: props.bottomAligned && 'auto',
}))


export const link = css`
display: inline-block;
margin-bottom: 20px;
color: #2B44FF;
`

export const LinkButton = styled.button`
    background:none!important;
    color:#2B44FF;
    border:none; 
    padding:0!important;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
    label: link-button;
`
LinkButton.displayName = 'LinkButton';


export const blackLinkRoot = css`
    font-weight: 500;
    font-size: 16px;
    text-transform: capitalize;
    text-decoration: none;
    color: black;
`

export const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`