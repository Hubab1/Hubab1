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
    snackbar: {
        position: 'fixed',
        top: 80, // toolbar offset
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, .8)',
    }
}));

export function MayorLoader({ isVisible }) {
    const classes = useStyles();

    return (
        <Snackbar
            className={classes.snackbar}
            open={isVisible}
            children={(
                <CircularProgress
                    size={96}
                    color="primary"
                    variant="indeterminate"
                    className={classes.loader}
                />
            )}
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
