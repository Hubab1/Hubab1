import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { APPLICATION_EVENTS, ROUTES } from 'app/constants';
import captureRoute from 'app/captureRoute';
import { PaymentTerms } from 'components/fees-deposits/PaymentTerms';
import API from 'app/api';
import { fetchApplicant } from 'reducers/applicant';
import { selectors } from 'reducers/renter-profile';

export const HoldingDepositReagreement = ({ profile, configuration, initialPage, history, _next }) => {
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
            const newApplicant = await API.fetchApplicant();
            const needToReagree = newApplicant.events.findIndex(
                (e) => parseInt(e.event) === parseInt(APPLICATION_EVENTS.MILESTONE_APPLICANT_NEEDS_TO_REAGREE_TO_HD)
            );
            console.log(needToReagree);
            if (needToReagree !== -1) {
                newApplicant.events.splice(needToReagree, 1);
            }

            console.log(initialPage);
            console.log(_next);
            history.push(initialPage);
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
    initialPage: PropTypes.string,
    history: PropTypes.object,
    _next: PropTypes.string,
    fetchApplicant: PropTypes.func,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    initialPage: selectors.selectDefaultInitialPage(state),
    _next: selectors.selectNextRoute(state),
});

const mapDispatchToProps = {
    fetchApplicant,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(captureRoute(HoldingDepositReagreement, ROUTES.HOLDING_DEPOSIT_TERMS_AGREEMENT));
