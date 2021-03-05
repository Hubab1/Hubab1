import {
    css
} from 'emotion';
import styled from '@emotion/styled';

export const root = css`
    border-radius: 21.5px !important;
    height: 45px;
`;

export const label = css`
    text-transform: none;
    font-size: 16px;
`;

export const mainDisabled = css`
    background-color: #D5D8DE !important;
    color: #ffffff !important;
    box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12) !important;
`;

export const ButtonContainer = styled.div(props => ({
    marginTop: props.marginTop || 0,
    marginBottom: props.marginBottom || 0,
    textDecoration: 'none',
    display: 'block',
}));
