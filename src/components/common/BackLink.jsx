import React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';

import { blackLinkRoot, arrowIcon } from 'assets/styles';

export const BackLink = props => {
    return <Link to={props.to} className={blackLinkRoot}>
        <ArrowBackIos classes={{root: arrowIcon}}/>Go Back 
    </Link>
};

BackLink.defaultProps = {
    to: '/'
};

BackLink.propTypes = {
    to: PropTypes.string,
};

export default BackLink;
