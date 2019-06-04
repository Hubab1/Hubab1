import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import { Link } from 'react-router-dom';



const backLinkRoot = css`
    font-weight: 500;
    font-size: 16px;
    text-transform: capitalize;
    text-decoration: none;
    color: black;
`

const arrowIcon = css`
    font-weight: 500 !important;
    font-size: 16px !important;
    vertical-align: sub;
`

export const BackLink = props => {
    return <Link to={props.to} className={backLinkRoot}>
        <ArrowBackIos classes={{root: arrowIcon}}/>Go Back
    </Link>
};

BackLink.propTypes = {
    onClick: PropTypes.func,
};

export default BackLink;
