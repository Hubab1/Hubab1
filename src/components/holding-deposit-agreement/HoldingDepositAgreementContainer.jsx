import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ROUTES, HELLOSIGN_TEST_MODE, DOCUMENT_TYPE_HOLDING_DEPOSIT, EVENT_HOLDING_DEPOSIT_SIGNED } from 'app/constants';
import { fetchPayments } from 'reducers/payments';
import withRelativeRoutes from 'app/withRelativeRoutes';
import HoldingDepositAgreementView from "./HoldingDepositAgreementView";
import hsclient from 'utils/hsclient';
import HoldingDepositAgreementConfirmation from "./HoldingDepositAgreementConfirmation";
import API from 'app/api';

export const HoldingDepositAgreementContainer = ({_prev, _nextRoute, configuration, profile, applicant, applicantUpdated}) => {
    const [currentPage, setCurrentPage] = useState('sign');

    useEffect(() => {
        const signedAgreement = !!profile.events.find(e => String(e.event) === String(EVENT_HOLDING_DEPOSIT_SIGNED));
        if (signedAgreement) {
            setCurrentPage('signed');
        }
    }, [profile]);

    useEffect(()=>{
        hsclient.on('sign', async () => {
            const newApplicant = await API.fetchApplicant();
            const signedAgreement = newApplicant.events.find(e => parseInt(e.event) === parseInt(EVENT_HOLDING_DEPOSIT_SIGNED));
            if (!signedAgreement) {
                newApplicant.events.push({event: EVENT_HOLDING_DEPOSIT_SIGNED, milestone: false});
            }
            applicantUpdated(newApplicant);
            // holding deposit may not be ready by the time of navigation to the lease signed page
            setTimeout(()=> setCurrentPage('signed'), 2500);
        });
        return () => {
            hsclient.off('sign');
        }
    }, [applicantUpdated]);

    const openEmbeddedSigning = async () => {
        const data = await API.embeddedSigningUrl(DOCUMENT_TYPE_HOLDING_DEPOSIT);

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
