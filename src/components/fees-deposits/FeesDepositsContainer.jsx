import React from 'react';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FeesDepositsOptions from './FeesDepositsOptions';
import { PaymentPage } from './PaymentPage/PaymentPage';


export const FeesDepositsContainer = ({_prev, _nextRoute, configuration, profile, applicant}) => {
    const [currentPage, setCurrentPage] = React.useState('options');
    if (!configuration || !profile || !applicant)  return <div/>;
    if (currentPage === 'options') {
        return <FeesDepositsOptions
            _prev={_prev}
            goToPayment={() => setCurrentPage('payment')}
            applicant={applicant}
            configuration={configuration}
            profile={profile}
        />
    } else if (currentPage === 'payment') {
        return <PaymentPage
            _nextRoute={_nextRoute}
            configuration={configuration}
            applicant={applicant}
            handleClickBack={() => setCurrentPage('options')}
        />
    }

    
}

const mapStateToProps = state => ({
    applicant: state.applicant,
    configuration: state.configuration,
    profile: state.renterProfile,
});

export default  connect(mapStateToProps)(withRelativeRoutes(FeesDepositsContainer, ROUTES.FEES_AND_DEPOSITS));