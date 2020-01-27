import React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import { HashLink } from 'react-router-hash-link';

import { blackLinkRoot, arrowIcon } from 'assets/styles'


export const BackLink = props => {
    return <HashLink to={props.to} className={blackLinkRoot}>
        <ArrowBackIos classes={{root: arrowIcon}}/>Go Back 
    </HashLink>
};

BackLink.defaultProps = {
    to: '/'
}

BackLink.propTypes = {
    to: PropTypes.string,
};

export default BackLink;
