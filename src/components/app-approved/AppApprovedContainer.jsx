import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { applicantUpdated } from 'reducers/applicant';
import { ROUTES } from 'app/constants';

import captureRoute from 'app/captureRoute';
import { fetchPayments } from 'reducers/payments';
import { SignLeaseView } from 'components/app-approved/SignLeaseView';
import { AppApprovedView } from 'components/app-approved/AppApprovedView';

export const AppApprovedContainer = ({ profile, configuration, history, applicantUpdated, applicant, payables }) => {
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    if (!profile || !configuration) return null;

    if (showPaymentDetails) {
        return (
            <SignLeaseView
                applicantUpdated={applicantUpdated}
                fetchPayments={fetchPayments}
                history={history}
                profile={profile}
                payables={payables}
                setShowPaymentDetails={setShowPaymentDetails}
            />
        );
    }

    return (
        <AppApprovedView
            applicant={applicant}
            configuration={configuration}
            profile={profile}
            setShowPaymentDetails={setShowPaymentDetails}
        />
    );
};

AppApprovedContainer.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    updateApplicant: PropTypes.object,
    applicant: PropTypes.object,
    history: PropTypes.object,
    applicantUpdated: PropTypes.func,
    payables: PropTypes.array,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
    payables: state.payables || [],
});

const mapDispatchToProps = {
    applicantUpdated,
    fetchPayments,
};

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(AppApprovedContainer, ROUTES.APP_APPROVED));
