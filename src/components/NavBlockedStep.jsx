import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ErrorIcon from '@material-ui/icons/Error';
import { prettyFormatPhoneNumber } from 'utils/misc';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { selectors } from 'reducers/renter-profile';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { css } from 'emotion';

const useStyles = makeStyles(() => ({
    root: {
        padding: 0,
    },
}));

const iconRoot = css`
    align-items: flex-start !important;
    .appCompletedMsg,
    .outstandingBalance {
        color: #828796;
    }
`;

const viewProgress = css`
    width: 192px;
    border-radius: 30px !important;
    text-transform: none !important;
    font-size: 16px !important;
    margin: 30px auto !important;
    display: block !important;
`;

export function NavBlockedStep({ text, history, config, initialPage, handleDrawerClose }) {
    const onClick = () => {
        history.push(initialPage);
        handleDrawerClose && handleDrawerClose();
    };

    return (
        <Step active>
            <StepLabel StepIconComponent={() => <ErrorIcon color="primary" />} active classes={{ root: iconRoot }}>
                <span className="stepBlockedMsg">
                    {text} Please call us at{' '}
                    <a href={`tel:${config.community.contact_phone}`}>
                        {prettyFormatPhoneNumber(config.community.contact_phone)}
                    </a>{' '}
                    so we can discuss some other options.
                </span>
            </StepLabel>
            <Button
                variant="outlined"
                color="default"
                id="viewProgressButton"
                classes={{
                    root: viewProgress,
                }}
                disabled={false}
                onClick={onClick}
            >
                View Progress
            </Button>
        </Step>
    );
}

NavBlockedStep.propTypes = {
    closeDrawer: PropTypes.bool,
    initialPage: PropTypes.string,
    history: PropTypes.object,
    text: PropTypes.string,
    config: PropTypes.object,
    handleDrawerClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
    initialPage: selectors.selectInitialPage(state),
    config: state.configuration,
});

export default connect(mapStateToProps, null)(withRouter(NavBlockedStep));
