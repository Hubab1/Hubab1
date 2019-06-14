import React from 'react';
import styled from '@emotion/styled';
import { withTheme } from '@material-ui/styles';

export const Container = styled.div`
    width: 100%;
    backgroundColor: white;
    height: 10px;
    box-shadow: 0 2px 4px 0 rgba(177,181,189,0.4);
`

export const Bar = withTheme(styled.div`
    width: ${props => `${props.percent}%`};
    background-color: ${props => props.theme.palette.primary.main};
    opacity: 0.7;
    height: 100%;
`);


function ProgressBar (props) {
    return (
        <Container>
            <Bar percent={props.percent}/>
        </Container>
    );
}

export default ProgressBar;