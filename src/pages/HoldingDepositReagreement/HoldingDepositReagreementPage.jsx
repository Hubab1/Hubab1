import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'constants/constants';
import API from 'api/api';
import captureRoute from 'utils/captureRoute';

import PaymentTerms from 'common-components/PaymentTerms/PaymentTerms';

export const HoldingDepositReagreementPage = ({ profile, configuration }) => {
    if (!profile || !configuration || !profile.lease_start_date) {
        return null;
    }

    const unitNumber = profile.unit?.unit_number;
    const communityName = profile.community?.display_name;
    const leaseStartDate = profile.lease_start_date;
    const holdingDepositAmount =
        parseFloat(profile.selected_rental_options?.['holding-deposit']?.[0]?.quoted_deposit_amount) || 0;

    const handleTermsAccepted = (data) => {
        API.acceptTerms(profile.id, data).then(async () => {
            window.location.reload();
        });
    };

    return (
        <PaymentTerms
            holdingDepositAmount={holdingDepositAmount}
            unitNumber={unitNumber}
            communityName={communityName}
            leaseStartDate={leaseStartDate}
            canProceedToPayment={true}
            isReagreeing={true}
            handleTermsAccepted={(data) => handleTermsAccepted(data)}
            application={profile}
        />
    );
};

HoldingDepositReagreementPage.propTypes = {
    profile: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(
    captureRoute(HoldingDepositReagreementPage, ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT)
);
