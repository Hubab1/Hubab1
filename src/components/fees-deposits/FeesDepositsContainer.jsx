import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPreventNonPrimaryFromPayingIfHeld } from 'selectors/launchDarkly';
import { ROUTES, LINE_ITEM_TYPE_HOLDING_DEPOSIT, ROLE_PRIMARY_APPLICANT } from 'app/constants';
import { fetchPayments } from 'reducers/payments';
import { fetchApplicant } from 'reducers/applicant';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FeesDepositsOptions from './FeesDepositsOptions';
import UnitNotHeldWaitingPage from './UnitNotHeldWaitingPage';
import { PaymentPage } from './PaymentPage/PaymentPage';
import FeesDepositsReceipt from './FeesDepositsReceipt';
import { PaymentTerms } from './PaymentTerms';
import API from 'app/api';

export const FeesDepositsContainer = ({
    _prev,
    _nextRoute,
    payables,
    profile,
    applicant,
    application,
    preventNonPrimaryFromPayingIfHeld,
    configuration,
    fetchPayments,
    isOutstanding,
    fetchApplicant,
    pageComplete,
}) => {
    const [currentPage, setCurrentPage] = useState('options');
    const [payments, setPayments] = useState(payables);
    const [totalPayment, setTotalPayment] = useState(null);
    const [receipt, setReceipt] = useState(applicant && applicant.receipt);

    const receiptPaid = !!receipt ? receipt.paid : false;

    useEffect(() => {
        if (receiptPaid && !isOutstanding) {
            setCurrentPage('receipt');
        } else {
            fetchPayments();
            fetchApplicant();
        }
    }, [receiptPaid, fetchPayments, isOutstanding, fetchApplicant]);

    useEffect(() => {
        setPayments(payables);
    }, [payables]);

    useEffect(() => {
        applicant && setReceipt(applicant.receipt);
    }, [applicant]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    if (!profile || !applicant || (!payments && !receipt && !isOutstanding)) return <div />;

    const isPrimaryApplicant = applicant.role === ROLE_PRIMARY_APPLICANT;
    const unitNumber = profile.unit?.unit_number;
    const communityName = profile.community?.display_name;
    const leaseStartDate = profile.lease_start_date;

    const handlePaymentOptionsContinue = (feesSelected, totalPayment) => {
        if (feesSelected === 'everyone') {
            const allPayments = payments.map((payment) => {
                if (parseInt(payment.type_ === LINE_ITEM_TYPE_HOLDING_DEPOSIT) && !isPrimaryApplicant) {
                    return payment;
                } else {
                    return Object.assign({}, payment, { paid: true });
                }
            });
            setPayments(allPayments);
        } else {
            const myPayments = payments.map((payment) => {
                if (parseInt(payment.applicant) === applicant.id) {
                    return Object.assign({}, payment, { paid: true });
                } else if (parseInt(payment.type_ === LINE_ITEM_TYPE_HOLDING_DEPOSIT) && isPrimaryApplicant) {
                    return Object.assign({}, payment, { paid: true });
                } else {
                    return payment;
                }
            });
            setPayments(myPayments);
        }
        setTotalPayment(totalPayment);
        setCurrentPage('terms');
    };

    const handleTermsAccepted = (data) => {
        API.acceptTerms(data).then(() => {
            setCurrentPage('payment');
        });
    };

    const baseAppFee = parseFloat(profile.selected_rental_options?.['app-fee']?.[0]?.quoted_fee_amount) || 0;
    const holdingDepositAmount =
        parseFloat(profile.selected_rental_options?.['holding-deposit']?.[0]?.quoted_deposit_amount) || 0;

    const everyone = profile.primary_applicant.guarantors.concat(profile.co_applicants).concat(profile.occupants);
    everyone.unshift(profile.primary_applicant);

    const goToPreviousPage = () => {
        const reportedNoIncome = !applicant.income_total && !applicant.asset_total;

        if (configuration.collect_employer_information && !reportedNoIncome) {
            return ROUTES.EMPLOYER_DETAILS;
        } else {
            return _prev;
        }
    };

    if (preventNonPrimaryFromPayingIfHeld && !isPrimaryApplicant && !profile.unit_is_held) {
        return (
            <UnitNotHeldWaitingPage
                primaryNameFirst={profile.primary_applicant.first_name}
                primaryNameLast={profile.primary_applicant.last_name}
                communityName={communityName}
                unitNumber={unitNumber}
            />
        );
    }

    if (currentPage === 'options') {
        return (
            <FeesDepositsOptions
                baseAppFee={baseAppFee}
                handleClickBack={goToPreviousPage}
                handleContinue={handlePaymentOptionsContinue}
                applicant={applicant}
                holdingDepositAmount={isPrimaryApplicant ? holdingDepositAmount : 0}
                everyone={everyone}
                payments={payables}
                unitNumber={unitNumber}
                communityName={communityName}
                isOutstanding={isOutstanding}
            />
        );
    } else if (currentPage === 'terms') {
        return (
            <PaymentTerms
                handleClickBack={() => setCurrentPage('options')}
                handleTermsAccepted={(data) => handleTermsAccepted(data)}
                holdingDepositAmount={holdingDepositAmount}
                unitNumber={unitNumber}
                communityName={communityName}
                leaseStartDate={leaseStartDate}
                canProceedToPayment={true}
            />
        );
    } else if (currentPage === 'payment') {
        return (
            <PaymentPage
                handleSuccess={() => setCurrentPage('receipt')}
                applicant={applicant}
                handleClickBack={() => setCurrentPage('terms')}
                payments={payments}
                totalPayment={totalPayment}
                isOutstanding={isOutstanding}
            />
        );
    } else if (currentPage === 'receipt') {
        if (!receipt) return <div />;
        return (
            <FeesDepositsReceipt
                receipt={receipt}
                handleContinue={_nextRoute}
                baseAppFee={baseAppFee}
                applicant={applicant}
                everyone={everyone}
                email={applicant.person.email}
                paidByAnother={receipt.paid_by !== applicant.id}
            />
        );
    }
};

FeesDepositsContainer.propTypes = {
    isOutstanding: PropTypes.bool,
    applicant: PropTypes.object,
    configuration: PropTypes.object,
    payables: PropTypes.array,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    configuration: state.configuration,
    profile: state.renterProfile,
    payables: state.payments,
    preventNonPrimaryFromPayingIfHeld: getPreventNonPrimaryFromPayingIfHeld(state),
});

const mapStateToPropsOutstandingBalance = (state) => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    payables: state.payments,
    isOutstanding: true,
});

export const FeesAndDeposits = connect(mapStateToProps, { fetchPayments, fetchApplicant })(
    withRelativeRoutes(FeesDepositsContainer, ROUTES.FEES_AND_DEPOSITS)
);

export const OutstandingBalance = connect(mapStateToPropsOutstandingBalance, { fetchPayments, fetchApplicant })(
    withRelativeRoutes(FeesDepositsContainer, ROUTES.OUTSTANDING_BALANCE)
);
