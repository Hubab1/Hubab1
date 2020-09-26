import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { css } from 'emotion';

const checkboxRoot = css`
    padding-top: 0 !important;
    padding-left: 0 !important;
    padding-right: 8px !important;
`;
const checkboxText = css`
    font-size: 12px;
    text-align: left;
`;

const gridContainer = css`
    padding: 20px 0 20px 0;
    text-align: left;
    display: flex;
    align-items: flex-start;
`;

// TODO: Avoid anon functions
//eslint-disable-next-line react/prop-types
export default function ({name, value, checked, onChange, error, label}) {
    return (
        <div className={gridContainer}>
            <Checkbox
                name={name}
                onChange={onChange}
                checked={checked}
                value={value}
                error={error}
                classes={{ root: checkboxRoot }}
            />
            <span className={checkboxText}>{label}</span>
        </div>
    );
}
