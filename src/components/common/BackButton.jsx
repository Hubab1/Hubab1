import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Button from '@material-ui/core/Button';


const backButtonRoot = css`
    font-weight: 500;
    font-size: 16px;
    text-transform: capitalize !important;
`

const arrowIcon = css`
    font-weight: 500 !important;
    font-size: 16px !important;
`

export const BackButton = props => {

    return <Button
        variant="text"
        classes={{root: backButtonRoot}}
        onClick={props.onClick}
    >
        <ArrowBackIos classes={{root: arrowIcon}}/> Go Back
    </Button>
}

BackButton.propTypes = {
    onClick: PropTypes.func,
};

export default BackButton;