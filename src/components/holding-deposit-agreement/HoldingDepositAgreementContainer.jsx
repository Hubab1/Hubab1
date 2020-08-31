import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ROUTES, HELLOSIGN_TEST_MODE } from 'app/constants';
import { fetchPayments } from 'reducers/payments';
import withRelativeRoutes from 'app/withRelativeRoutes';
import HoldingDepositAgreementView from "./HoldingDepositAgreementView";
import hsclient from 'utils/hsclient';
import HoldingDepositAgreementConfirmation from "./HoldingDepositAgreementConfirmation";


export const HoldingDepositAgreementContainer = ({_prev, _nextRoute, configuration, profile, applicant}) => {
    const [currentPage, setCurrentPage] = useState('sign');

    useEffect(() => {
        // TODO: Replace by real event when created
        const signedAgreement = !!profile.events.find(e => String(e.event) === String('Applicant signed Agreement event here'));
        if (signedAgreement) {
            setCurrentPage('signed');
        }
    }, [profile]);

    useEffect(()=>{
        hsclient.on('sign', async () => {
            // TODO: Add signing agreement logic here
        });
        return () => {
            hsclient.off('sign');
        }
    }, []);

    const openEmbeddedSigning = async () => {
        // TODO: Replace by real API when created
        // const data = await API.holdingDepositAgreementUrl();
        const data = { url: 'https://app.hellosign.com/editor/embeddedSign?signature_id=123'};
        if (data.url) {
            hsclient.open(data.url, {
                testMode: HELLOSIGN_TEST_MODE,
                skipDomainVerification: HELLOSIGN_TEST_MODE,
                allowDecline: false,
            });
        }
    };

    if (!profile || !applicant)  return <div/>;

    if (currentPage === 'signed') {
        return (
            <HoldingDepositAgreementConfirmation
                applicant={applicant}
                profile={profile}
                configuration={configuration}
                handleContinue={()=> _nextRoute}
                viewDocument={() => openEmbeddedSigning()}
            />
        )
    } else {
        return (
            <HoldingDepositAgreementView
                applicant={applicant}
                profile={profile}
                configuration={configuration}
                handleContinue={()=> openEmbeddedSigning()}
                handleClickBack={_prev}
            />
        );
    }
};

const mapStateToProps = state => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    payables: state.payments,
    configuration: state.configuration,
});

export default  connect(mapStateToProps, { fetchPayments })(withRelativeRoutes(HoldingDepositAgreementContainer, ROUTES.HOLDING_DEPOSIT_AGREEMENT));
