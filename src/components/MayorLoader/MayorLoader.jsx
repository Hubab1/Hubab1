import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { Backdrop, CircularProgress, Fade } from '@material-ui/core';

import { selectors } from 'reducers/loader';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.primary.main,
        backgroundColor: 'rgba(255, 255, 255, .5)',
    },
}));

export function MayorLoader({ isVisible }) {
    const classes = useStyles();

    return (
        <Backdrop
            className={classes.backdrop}
            open={isVisible}
            TransitionComponent={Fade}
            transitionDuration={{
                enter: 0,
                exit: 500,
            }}
        >
            <CircularProgress color="inherit" size={96} />
        </Backdrop>
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
