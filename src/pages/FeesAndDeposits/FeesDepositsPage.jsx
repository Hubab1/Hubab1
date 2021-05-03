import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ROUTES, LINE_ITEM_TYPE_HOLDING_DEPOSIT, ROLE_PRIMARY_APPLICANT } from 'constants/constants';
import API from 'api/api';
import { getPreventNonPrimaryFromPayingUnheldUnit } from 'selectors/launchDarkly';
import withRelativeRoutes from 'utils/withRelativeRoutes';

import { fetchPayments } from 'reducers/payments';
import { fetchApplicant } from 'reducers/applicant';
import { actions as loaderActions } from 'reducers/loader';

import PaymentTerms from 'common-components/PaymentTerms/PaymentTerms';
import FeesDepositsOptions from 'pages/FeesAndDeposits/components/FeesDepositsOptions';
import UnitNotHeldWaitingPage from 'pages/FeesAndDeposits/components/UnitNotHeldWaitingPage';
import FeesDepositsReceipt from 'pages/FeesAndDeposits/components/FeesDepositsReceipt';
import Payment from 'pages/FeesAndDeposits/components/Payment';
import { generatePath } from 'react-router';

export const FeesDepositsPage = ({
    _prev,
    _nextRoute,
    payables,
    profile,
    applicant,
    preventNonPrimaryFromPayingUnheldUnit,
    configuration,
    isOutstanding,
    toggleLoader,
    fetchPayments,
    fetchApplicant,
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
        toggleLoader(true);

        API.acceptTerms(profile.id, data)
            .then(() => {
                setCurrentPage('payment');
            })
            .finally(() => {
                toggleLoader(false);
            });
    };

    const baseAppFee = parseFloat(profile.selected_rental_options?.['app-fee']?.[0]?.quoted_fee_amount) || 0;
    const holdingDepositAmount =
        parseFloat(profile.selected_rental_options?.['holding-deposit']?.[0]?.quoted_deposit_amount) || 0;

    const everyone = profile.guarantors.concat(profile.co_applicants).concat(profile.occupants);
    everyone.unshift(profile.primary_applicant);

    const goToPreviousPage = () => {
        const reportedNoIncome = !applicant.income_total && !applicant.asset_total;

        if (configuration.collect_employer_information && !reportedNoIncome) {
            return generatePath(ROUTES.EMPLOYER_DETAILS, { application_id: profile.id });
        } else {
            return _prev;
        }
    };

    if (preventNonPrimaryFromPayingUnheldUnit && !isPrimaryApplicant && !profile.unit_is_held) {
        return (
            <UnitNotHeldWaitingPage
                primaryApplicantFirstName={profile.primary_applicant.first_name}
                primaryApplicantLastName={profile.primary_applicant.last_name}
                communityName={communityName}
                unitNumber={unitNumber}
            />
        );
    }

    if (currentPage === 'options') {
        return (
            <FeesDepositsOptions
                baseAppFee={baseAppFee}
                applicant={applicant}
                holdingDepositAmount={isPrimaryApplicant ? holdingDepositAmount : 0}
                everyone={everyone}
                payments={payables}
                unitNumber={unitNumber}
                communityName={communityName}
                isOutstanding={isOutstanding}
                handleClickBack={goToPreviousPage}
                handleContinue={handlePaymentOptionsContinue}
            />
        );
    } else if (currentPage === 'terms') {
        return (
            <PaymentTerms
                holdingDepositAmount={holdingDepositAmount}
                unitNumber={unitNumber}
                communityName={communityName}
                leaseStartDate={leaseStartDate}
                canProceedToPayment={true}
                handleClickBack={() => setCurrentPage('options')}
                handleTermsAccepted={(data) => handleTermsAccepted(data)}
                application={profile}
            />
        );
    } else if (currentPage === 'payment') {
        return (
            <Payment
                applicant={applicant}
                payments={payments}
                totalPayment={totalPayment}
                isOutstanding={isOutstanding}
                handleSuccess={() => setCurrentPage('receipt')}
                handleClickBack={() => setCurrentPage('terms')}
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

FeesDepositsPage.propTypes = {
    isOutstanding: PropTypes.bool,
    applicant: PropTypes.object,
    configuration: PropTypes.object,
    payables: PropTypes.array,
    toggleLoader: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    configuration: state.configuration,
    profile: state.renterProfile,
    payables: state.payments,
    preventNonPrimaryFromPayingUnheldUnit: getPreventNonPrimaryFromPayingUnheldUnit(state),
});

const mapStateToPropsOutstandingBalance = (state) => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    payables: state.payments,
    isOutstanding: true,
});

const mapDispatchToProps = {
    fetchPayments,
    fetchApplicant,
    toggleLoader: loaderActions.toggleLoader,
};

export const FeesAndDepositsPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRelativeRoutes(FeesDepositsPage, ROUTES.FEES_AND_DEPOSITS));

export const OutstandingBalancePage = connect(
    mapStateToPropsOutstandingBalance,
    mapDispatchToProps
)(withRelativeRoutes(FeesDepositsPage, ROUTES.OUTSTANDING_BALANCE));
