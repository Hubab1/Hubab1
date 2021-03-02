import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Snackbar, CircularProgress } from '@material-ui/core';

import { selectors } from 'reducers/loader';

const useStyles = makeStyles((theme) => ({
    loader: {
        color: theme.palette.primary.main,
        padding: 0,
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

export function MayorLoader({ isVisible }) {
    const classes = useStyles();

    const anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'right',
    };

    return (
        <Snackbar
            anchorOrigin={anchorOrigin}
            open={isVisible}
            children={<CircularProgress size={35} color="primary" variant="indeterminate" className={classes.loader} />}
        />
    );
}

MayorLoader.propTypes = {
    isVisible: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isVisible: selectors.getIsVisible(state),
});

const mapActionsToProps = null;

export default connect(mapStateToProps, mapActionsToProps)(MayorLoader);
