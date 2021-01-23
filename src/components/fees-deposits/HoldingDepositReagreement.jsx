import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ROUTES } from 'app/constants';
import captureRoute from 'app/captureRoute';
import { PaymentTerms } from 'components/fees-deposits/PaymentTerms';
import API from 'app/api';

export const HoldingDepositReagreement = ({ profile, configuration }) => {
    if (!profile || !configuration || !profile.lease_start_date) {
        return null;
    }

    const unitNumber = profile.unit?.unit_number;
    const communityName = profile.community?.display_name;
    const leaseStartDate = profile.lease_start_date;
    const holdingDepositAmount =
        parseFloat(profile.selected_rental_options?.['holding-deposit']?.[0]?.quoted_deposit_amount) || 0;

    const handleTermsAccepted = (data) => {
        API.acceptTerms(data).then(async () => {
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
            reagree={(data) => handleTermsAccepted(data)}
        />
    );
};

HoldingDepositReagreement.propTypes = {
    profile: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(
    captureRoute(HoldingDepositReagreement, ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT)
);
