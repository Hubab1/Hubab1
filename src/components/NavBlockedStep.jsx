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
import { css } from 'emotion';

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

export function NavBlockedStep(props) {
    const { text, history, config, initialPage, handleDrawerClose, stepProps, stepClass } = props;

    const onClick = () => {
        history.push(initialPage);
        handleDrawerClose && handleDrawerClose();
    };

    return (
        <Step active>
            <StepLabel {...stepProps}>
                <span className={stepClass}>
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
    initialPage: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    handleDrawerClose: PropTypes.func,
    stepClass: PropTypes.string.isRequired,
    stepProps: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    initialPage: selectors.selectInitialPage(state),
    config: state.configuration,
});

const ConnectedNavBlockedStep = connect(mapStateToProps, null)(withRouter(NavBlockedStep));

export default ConnectedNavBlockedStep;

export function NavBlockedInProgressStep(props) {
    return (
        <ConnectedNavBlockedStep
            {...props}
            stepClass={'stepBlockedMsg'}
            stepProps={{
                active: true,
                classes: { root: iconRoot },
                StepIconComponent: () => <ErrorIcon color="primary" />,
            }}
        />
    );
}

export function NavBlockedCompletedStep(props) {
    return (
        <ConnectedNavBlockedStep
            {...props}
            stepClass={'appCompletedMsg'}
            stepProps={{
                completed: true,
                classes: { root: iconRoot },
            }}
        />
    );
}

NavBlockedCompletedStep.propTypes = {
    text: PropTypes.string.isRequired,
};

NavBlockedInProgressStep.propTypes = {
    text: PropTypes.string.isRequired,
};
