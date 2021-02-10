import React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { Link } from 'react-router-dom';

import { blackLinkRoot, arrowIcon } from 'assets/styles';

export const BackLink = (props) => {
    return (
        <Link to={props.to} className={blackLinkRoot}>
            <ArrowBackIos classes={{ root: arrowIcon }} />
            Go Back
        </Link>
    );
};

BackLink.propTypes = {
    to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

BackLink.defaultProps = {
    to: '/',
};

// for the back buttons that are not links
export const BackButton = ({ text = 'Go Back', onClick = () => {} }) => {
    return (
        <span className={blackLinkRoot} onClick={onClick}>
            <ArrowBackIos classes={{ root: arrowIcon }} /> {text}
        </span>
    );
};

BackButton.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
};

export default BackLink;
