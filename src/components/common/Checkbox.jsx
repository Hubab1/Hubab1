import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { css } from 'emotion';

const noPaddingTop = css`
    padding-top: 0 !important;
`
const checkboxText = css`
    font-size: 12px;
    text-align: left;
`

const textLeft = css`
    text-align: left;
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`

export default function ({name, value, checked, onChange, error, label}) {
    return (
        <div className={gridContainer}>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid item xs={2}>
                    <Checkbox
                        name={name}
                        onChange={onChange}
                        checked={checked}
                        value={value}
                        error={error}
                        classes={{ root: noPaddingTop }}
                    />
                </Grid>
                <Grid classes={{root: textLeft}} item xs={10}>
                    <span className={checkboxText}>{label}</span>
                </Grid>
            </Grid>
        </div>
    )
}
