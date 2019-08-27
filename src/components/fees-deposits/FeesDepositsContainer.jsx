import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import API from 'app/api';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FeesDepositsOptions from './FeesDepositsOptions';
import { PaymentPage } from './PaymentPage/PaymentPage';
import PaymentTerms from './PaymentTerms';


export const FeesDepositsContainer = ({_prev, _nextRoute, configuration, profile, applicant}) => {

    const [currentPage, setCurrentPage] = useState('options');
    const [payments, setPayments] = useState({});

    useEffect(() => {
        API.fetchPaymentOptions().then(data => {
            debugger;
            setPayments(data.payables);
        })
    }, [])


    if (!configuration || !profile || !applicant || !payments)  return <div/>;
    if (currentPage === 'options') {
        return <FeesDepositsOptions
            _prev={_prev}
            goToPayment={() => setCurrentPage('terms')}
            applicant={applicant}
            configuration={configuration}
            profile={profile}
            payments={payments}
        />
    } else if (currentPage === 'terms') {
        return <PaymentTerms 
            handleClickBack={() => setCurrentPage('options')}
            goToPayment={() => setCurrentPage('payment')}
        />
    } else if (currentPage === 'payment') {
        return <PaymentPage
            goToReceipt={() => setCurrentPage('receipt')}
            configuration={configuration}
            applicant={applicant}
            handleClickBack={() => setCurrentPage('terms')}
        />
    } else if (currentPage === 'receipt') {
        return <PaymentPage
            handleContinue={() => setCurrentPage('receipt')}
            configuration={configuration}
            applicant={applicant}
            handleClickBack={() => setCurrentPage('terms')}
        />
    }

    
}

const mapStateToProps = state => ({
    applicant: state.applicant,
    configuration: state.configuration,
    profile: state.renterProfile,
});

export default  connect(mapStateToProps)(withRelativeRoutes(FeesDepositsContainer, ROUTES.FEES_AND_DEPOSITS));