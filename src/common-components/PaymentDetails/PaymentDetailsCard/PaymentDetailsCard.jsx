import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { makeStyles, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

import { format, parseISO } from 'date-fns';

import PaidText from 'common-components/PaidText/PaidText';
import { PaymentDetailRows } from '../PaymentDetailsRow/PaymentDetailRow';
import { PaymentDetailSavingsRows } from '../PaymentDetailSavingsRows/PaymentDetailSavingsRow';
import { Card } from 'assets/styles';
import { styles } from '../styles';
import lightbulb from 'assets/images/lightbulb.png';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        padding: 0,
    },
}));

export const PaymentCard = styled(Card)`
    padding: 15px;
`;

export const PaymentDetailsCard = ({ profile, applicationFees }) => {
    const leaseStartDate = format(parseISO(profile.lease_start_date), 'MM/dd/yyyy');

    return (
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
                amount={applicationFees.total}
                label={'due at application'}
                defaultExpanded={false}
                isPaid={applicationFees.allPaid}
            >
                <PaymentDetailRows paymentObject={applicationFees} paymentType="application" />
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
            {profile.fees_breakdown.savings?.items.length > 0 && (
                <PaymentItemsExpansionPanel
                    amount={profile.fees_breakdown.savings.total}
                    label={'savings'}
                    defaultExpanded={false}
                >
                    <PaymentDetailSavingsRows paymentObject={profile.fees_breakdown.savings} paymentType="savings" />
                </PaymentItemsExpansionPanel>
            )}
        </PaymentCard>
    );
};

PaymentDetailsCard.propTypes = {
    profile: PropTypes.object.isRequired,
    payables: PropTypes.array,
};

export function PaymentItemsExpansionPanel({ children, defaultExpanded, label, amount, isPaid }) {
    const classes = useStyles();

    return (
        <div className={styles.itemsContainer}>
            <ExpansionPanel elevation={0} defaultExpanded={defaultExpanded}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={styles.itemsContainerLabel}>
                        <b>${amount}</b>&nbsp;{label}
                    </div>
                    {isPaid && (
                        <div className={styles.paidText}>
                            <PaidText />
                        </div>
                    )}
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
    isPaid: PropTypes.bool,
    applicationFees: PropTypes.object,
};
