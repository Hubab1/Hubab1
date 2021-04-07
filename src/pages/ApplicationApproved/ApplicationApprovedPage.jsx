import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'constants/constants';
import captureRoute from 'utils/captureRoute';
import { applicantUpdated } from 'reducers/applicant';
import { fetchPayments } from 'reducers/payments';
import { selectors } from 'reducers/renter-profile';
import { selectors as configurationSelectors } from 'reducers/site-config';

import { ApplicationApprovedView } from 'pages/ApplicationApproved/components/ApplicationApprovedView';
import { SignLeaseView } from 'pages/ApplicationApproved/components/SignLeaseView';

export const ApplicationApprovedPage = ({
    profile,
    configuration,
    history,
    applicantUpdated,
    applicant,
    applicationFees,
    leaseSettingsId,
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
                leaseSettingsId={leaseSettingsId}
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
    leaseSettingsId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
    applicationFees: selectors.applicationFees(state),
    leaseSettingsId: configurationSelectors.getLeaseSettingsId(state),
});

const mapDispatchToProps = {
    applicantUpdated,
    fetchPayments,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(captureRoute(ApplicationApprovedPage, ROUTES.APPLICATION_STATUS_APPROVED));
