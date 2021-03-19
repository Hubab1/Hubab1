import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';
import { applicantUpdated } from 'reducers/applicant';
import { fetchPayments } from 'reducers/payments';

import { ApplicationApprovedView } from 'pages/ApplicationApproved/components/ApplicationApprovedView';
import { SignLeaseView } from 'pages/ApplicationApproved/components/SignLeaseView';
import { selectors } from 'reducers/renter-profile';

export const ApplicationApprovedPage = ({
    profile,
    configuration,
    history,
    applicantUpdated,
    applicant,
    applicationFees,
}) => {
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    if (!profile || !configuration) return null;

    if (showPaymentDetails) {
        return (
            <SignLeaseView
                applicantUpdated={applicantUpdated}
                fetchPayments={fetchPayments}
                history={history}
                profile={profile}
                applicationFees={applicationFees}
                setShowPaymentDetails={setShowPaymentDetails}
            />
        );
    }

    return (
        <ApplicationApprovedView
            applicant={applicant}
            configuration={configuration}
            profile={profile}
            setShowPaymentDetails={setShowPaymentDetails}
        />
    );
};

ApplicationApprovedPage.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    updateApplicant: PropTypes.object,
    applicant: PropTypes.object,
    history: PropTypes.object,
    applicantUpdated: PropTypes.func,
    applicationFees: PropTypes.object,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
    applicationFees: selectors.applicationFees(state),
});

const mapDispatchToProps = {
    applicantUpdated,
    fetchPayments,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(captureRoute(ApplicationApprovedPage, ROUTES.APPLICATION_STATUS_APPROVED));
