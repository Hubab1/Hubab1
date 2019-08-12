import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import styled from '@emotion/styled';

import { Bold } from 'assets/styles';
import lightbulb from 'assets/images/lightbulb.png';
const Bulb = styled.img`
    width: 50px;
    height: 46px;
`

export default function Tip (props) {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item>
                <Bulb alt="light bulb" src={lightbulb} />
            </Grid>
            <Grid item xs>
                <Grid item xs>
                    <Bold fontSize={16}>{props.header}</Bold>
                </Grid>
                <Grid item xs>
                    {props.text}
                </Grid>
            </Grid>
        </Grid>
    )
}

Tip.propTypes = {
    header: PropTypes.any,
    text: PropTypes.any,
}