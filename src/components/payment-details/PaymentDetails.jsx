import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import { H1, SpacedH3 } from 'assets/styles';
import captureRoute from 'app/captureRoute';

import { makeStyles } from '@material-ui/core/styles';

import { fetchPayments } from 'reducers/payments';
import { PaymentDetailsCard } from 'components/payment-details/PaymentDetailsCard';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        padding: 0,
    },
}));

export const PaymentDetails = ({ profile, configuration, payables, fetchPayments }) => {
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    if (!profile || !configuration || !profile.lease_start_date) {
        return null;
    }

    return (
        <>
            <H1>Payment Details</H1>
            <SpacedH3>Here’s the breakdown for unit {profile.unit.unit_number}</SpacedH3>
            <PaymentDetailsCard fetchPayments={fetchPayments} payables={payables} profile={profile} />
        </>
    );
};

PaymentDetails.propTypes = {
    fetchPayments: PropTypes.func.isRequired,
    profile: PropTypes.object,
    configuration: PropTypes.object.isRequired,
    payables: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
    payables: state.payments || [],
});

export default connect(mapStateToProps, { fetchPayments })(captureRoute(PaymentDetails, ROUTES.PAYMENT_DETAILS));
