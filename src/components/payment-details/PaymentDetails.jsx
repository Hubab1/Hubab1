import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import { Card, H1, SpacedH3 } from 'assets/styles';
import captureRoute from 'app/captureRoute';
import lightbulb from 'assets/images/lightbulb.png';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';

import { makeStyles } from '@material-ui/core/styles';
import { PaymentDetailRows } from 'components/payment-details/PaymentDetailRow';
import { styles } from './styles';
import { format, parseISO } from 'date-fns';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        padding: 0,
    },
}));

export const PaymentCard = styled(Card)`
    padding: 15px;
`;

export const PaymentDetails = ({ profile, configuration }) => {
    if (!profile || !configuration || !profile.lease_start_date) return null;

    const leaseStartDate = format(parseISO(profile.lease_start_date), 'MM/dd/yyyy');

    return (
        <>
            <H1>Payment Details</H1>
            <SpacedH3>Here’s the breakdown for unit {profile.unit.unit_number}</SpacedH3>
            <PaymentCard>
                <div className={styles.headerContainer}>
                    <div className={styles.imageWrapper}>
                        <img alt="coin" src={lightbulb} />
                    </div>
                    <div className={styles.cardHeader}>
                        <div className={styles.title}>Payment breakdown</div>
                        <div>Move in date: {leaseStartDate}</div>
                        <div>Lease term: {profile.lease_term} months</div>
                    </div>
                </div>
                <PaymentItemsExpansionPanel
                    amount={profile.fees_breakdown.application_fees.total}
                    label={'due at application'}
                    defaultExpanded={false}
                >
                    <PaymentDetailRows
                        paymentObject={profile.fees_breakdown.application_fees}
                        paymentType="application"
                    />
                </PaymentItemsExpansionPanel>
                <PaymentItemsExpansionPanel
                    amount={profile.fees_breakdown.move_in_fees.total}
                    label={'due at move in'}
                    defaultExpanded={false}
                >
                    <PaymentDetailRows paymentObject={profile.fees_breakdown.move_in_fees} paymentType="move_in" />
                </PaymentItemsExpansionPanel>
                <PaymentItemsExpansionPanel
                    amount={profile.fees_breakdown.monthly_fees.total}
                    label={'monthly rent'}
                    defaultExpanded={false}
                >
                    <PaymentDetailRows paymentObject={profile.fees_breakdown.monthly_fees} paymentType="monthly_fees" />
                </PaymentItemsExpansionPanel>
            </PaymentCard>
        </>
    );
};

PaymentDetails.propTypes = {
    profile: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
};

function PaymentItemsExpansionPanel({ children, defaultExpanded, label, amount }) {
    const classes = useStyles();

    return (
        <div className={styles.itemsContainer}>
            <ExpansionPanel elevation={0} defaultExpanded={defaultExpanded}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <b>${amount}</b>&nbsp;{label}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{ root: classes.root }}>
                    {React.Children.map(children, (child) => (
                        <div className={styles.itemRow}>{child}</div>
                    ))}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

PaymentItemsExpansionPanel.propTypes = {
    children: PropTypes.object,
    defaultExpanded: PropTypes.bool,
    label: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    configuration: state.configuration,
});

export default connect(mapStateToProps)(captureRoute(PaymentDetails, ROUTES.PAYMENT_DETAILS));
