import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ROUTES, LINE_ITEM_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import { fetchPayments } from 'reducers/payments';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FeesDepositsOptions from './FeesDepositsOptions';
import { PaymentPage } from './PaymentPage/PaymentPage';
import FeesDepositsReceipt from './FeesDepositsReceipt';
import PaymentTerms from './PaymentTerms';


export const FeesDepositsContainer = ({_prev, _nextRoute, configuration, payables, profile, applicant, fetchPayments}) => {

    const [currentPage, setCurrentPage] = useState('options');
    const [payments, setPayments] = useState(payables);
    const [totalPayment, setTotalPayment] = useState(null);
    const [receipt, setReceipt] = useState(applicant && applicant.receipt);

    useEffect( () => {
        if (receipt) {
            setCurrentPage('receipt');
        } else {
            fetchPayments();
        }
    }, [])

    useEffect( () => {
        setPayments(payables);
    }, [payables])

    useEffect( () => {
        applicant && setReceipt(applicant.receipt);
    }, [applicant])



    const handlePaymentOptionsContinue = (feesSelected, totalPayment) => {
        if (feesSelected === 'everyone') {
            const allPayments = payments.map(payment => Object.assign({}, payment, {paid: true}));
            setPayments(allPayments);
        } else {
            const myPayments = payments.map(payment => {
                if (parseInt(payment.applicant) === applicant.id) {
                    return Object.assign({}, payment, {paid: true});
                } else if (parseInt(payment.type_ === LINE_ITEM_TYPE_HOLDING_DEPOSIT)) {
                    return Object.assign({}, payment, {paid: true});
                } else {
                    return payment
                }
            })
            setPayments(myPayments)
        }
        setTotalPayment(totalPayment);
        setCurrentPage('terms');
    }

    if (!configuration || !profile || !applicant || (!payments && !receipt))  return <div/>;
    const everyone = profile.primary_applicant.guarantors.concat(profile.co_applicants);
    everyone.unshift(profile.primary_applicant);
    if (currentPage === 'options') {
        return <FeesDepositsOptions
            baseAppFee={configuration.application_fee}
            handleClickBack={_prev}
            handleContinue={handlePaymentOptionsContinue}
            applicant={applicant}
            holdingDepositAmount={configuration.holding_deposit_value || 0}
            everyone={everyone}
            payments={payments}
        />
    } else if (currentPage === 'terms') {
        return <PaymentTerms 
            handleClickBack={() => setCurrentPage('options')}
            goToPayment={() => setCurrentPage('payment')}
        />
    } else if (currentPage === 'payment') {
        return <PaymentPage
            handleSuccess={() => setCurrentPage('receipt')}
            applicant={applicant}
            handleClickBack={() => setCurrentPage('terms')}
            payments={payments}
            totalPayment={totalPayment}
        />
    } else if (currentPage === 'receipt') {
        if (!receipt) return <div/>
        return <FeesDepositsReceipt
            receipt={receipt}
            handleContinue={_nextRoute}
            baseAppFee={configuration.application_fee}
            applicant={applicant}
            everyone={everyone}
            email={applicant.client.person.email}
            paidByAnother={receipt.paid_by !== applicant.id}
        />
    }

    
}

const mapStateToProps = state => ({
    applicant: state.applicant,
    configuration: state.configuration,
    profile: state.renterProfile,
    payables: state.payments
});

export default  connect(mapStateToProps, { fetchPayments })(withRelativeRoutes(FeesDepositsContainer, ROUTES.FEES_AND_DEPOSITS));