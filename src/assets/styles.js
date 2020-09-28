import React from 'react';
import { withTheme } from '@material-ui/styles';
import { css } from 'emotion';
import styled from '@emotion/styled';

export const formContent = css`
    padding: 10px;
    margin: auto;
    max-width: 500px;
`;

export const cursor = css`
    cursor: pointer !important;
`;

export const linkNoStyle = css`
    text-decoration: none;
`;

export const ErrorDetail = styled.div`
    color: #f44336;
    text-align: left;
    font-size: 0.75rem;
    margin: 8px 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1em;
`;

export const Logo = styled.img`
    max-width: 120px;
    max-height: 50px;
`;

export const Bold = styled.b`
    font-size: ${props => props.fontSize ? `${props.fontSize}px` : 'inherit'};
    font-weight: ${props => props.fontWeight ? `${props.fontWeight}` : '600'};
`;

export const H1 = styled.h1`
    font-weight:600;
    font-size:23px;
    margin: 0 auto;
    padding: 0;
`;

export const H2 = styled.h2`
    font-weight: 400;
    font-size: 20px;
`;

export const H3 = styled.h3`
    font-weight: 400;
    line-height: 22px;
    font-size: 18px;
    color: #454B57;
    margin: 0;
`;

export const Span = styled.span`
    font-size: ${props => props.fontSize ? `${props.fontSize}px` : 'inherit'};
`;

export const PrimarySpan = withTheme((props) => {
    const { theme, ...rest } = props;
    return (
        <span {...rest} style={{color: theme.palette.primary.main}}>
            {props.children}
        </span>
    );
});

export const P = styled.p(props => ({
    fontWeight: props.fontWeight ? props.fontWeight : props.bold ? 600 : 400,
    fontSize: props.fontSize ? props.fontSize : 16,
    margin: props.margin ? props.margin : 0,
    marginTop: props.bottomAligned && 'auto',
    color: props.color ? props.color : 'inherit',
    textDecoration: props.decoration || 'none',
    overflow: props.overflow || 'auto',
    padding: props.padding || 0,
    textAlign: props.textAlign || 'inherit',
}));


export const link = css`
display: inline-block;
margin-bottom: 20px;
color: #2B44FF;
`;

export const LinkButton = styled.button`
    background:none!important;
    color:#2B44FF;
    border:none; 
    padding:0!important;
    font: inherit;
    cursor: pointer;
    text-decoration: underline;
    label: link-button;
    font-size: 14px;
`;
LinkButton.displayName = 'LinkButton';


export const blackLinkRoot = css`
    font-weight: 500 !important;
    font-size: 16px !important;
    text-transform: capitalize;
    text-decoration: none !important;
    color: black !important;
    cursor: pointer;
`;

export const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`;

export const CardSection = styled.div`
    padding: 15px;
`;

export const Spacer = styled.div`
    height: ${props => props.height ? `${props.height}px` : '20px'}
`;

export const ScrollableTermsCardSection = styled(CardSection)`
    overflow: auto;
    padding: 30px;
    height: 60vh;
    font-size: 14px;
`;

export const Card = styled.div`
    margin-bottom: 20px;
    border: 1px solid #EEEEEE;	
    border-radius: 5px;	
    box-shadow: 0 2px 4px 0 rgba(197,197,197,0.5);
    text-align: left;
`;
export const leftText = css`
    text-align: left;
`;

export const CardRow = styled.div`
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
    justify-content: space-between;
    &:first-of-type {
        padding-top: 0;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

export const CardRowBorderless = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const CardRowTotal = styled(CardRow)`
    width: 100%;
    box-sizing: content-box;
    background-color: rgba(86,186,130,0.1);
    margin: 0 0 -15px -15px;
    padding: 15px !important;
`;

export const infoIconRoot = css`
    height: inherit !important;
`;

export const arrowIcon = css`
    font-weight: 500 !important;
    font-size: 16px !important;
    vertical-align: sub;
`;

export const paperRoot = css`
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,.1) !important;
    border-width: 0px !important;
    padding: 15px !important;
    font-size: 16px !important;
    border-radius: 5px;
    .MuiButton-root {
        font-weight: 600;
    }
`;

export const colorManatee = css`
    color: #828796 !important;
`;

export const applicationStatus = css`
    color: #828796;
    font-size: 12px;
`;

export const styles = {
    formContent,
    cursor,
    linkNoStyle,
    link,
    blackLinkRoot,
    leftText,
    infoIconRoot,
    arrowIcon,
    paperRoot,
    colorManatee,
};
