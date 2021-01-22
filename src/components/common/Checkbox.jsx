import React from 'react';
import PropTypes from 'prop-types';
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

export default function LabeledCheckbox({ name, value, checked, onChange, error, label }) {
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

LabeledCheckbox.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    checked: PropTypes.bool,
    value: PropTypes.any,
    error: PropTypes.any,
    checkboxRoot: PropTypes.any,
    label: PropTypes.string,
};
