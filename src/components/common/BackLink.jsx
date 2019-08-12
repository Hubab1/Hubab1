import React from 'react';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import { Link } from 'react-router-dom';

import { blackLinkRoot } from 'assets/styles'


const arrowIcon = css`
    font-weight: 500 !important;
    font-size: 16px !important;
    vertical-align: sub;
`

export const BackLink = props => {
    return <Link to={props.to} className={blackLinkRoot}>
        <ArrowBackIos classes={{root: arrowIcon}}/>Go Back 
    </Link>
};

BackLink.defaultProps = {
    to: '/'
}

BackLink.propTypes = {
    to: PropTypes.string,
};

export default BackLink;
