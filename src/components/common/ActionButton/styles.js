import {
    css
} from 'emotion';
import styled from '@emotion/styled';

export const root = css`
    border-radius: 21.5px !important;
    height: 45px;
`

export const label = css`
    text-transform: none;
`

export const ButtonContainer = styled.div(props => ({
    marginTop: props.marginTop || 0,
    marginBottom: props.marginBottom || 0
}))
