import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import {
    ROUTES,
    DOCUMENT_TYPE_HOLDING_DEPOSIT,
    APPLICANT_EVENTS,
    MILESTONE_APPLICANT_SUBMITTED,
    EVENT_SCREENING_COMPLETED,
} from 'constants/constants';
import API from 'api/api';
import withRelativeRoutes from 'utils/withRelativeRoutes';
import hsclient from 'utils/hsclient';

import { fetchPayments } from 'reducers/payments';
import { applicantUpdated } from 'reducers/applicant';

import HoldingDepositAgreementView from 'pages/HoldingDepositAgreement/components/HoldingDepositAgreementView';
import HoldingDepositAgreementConfirmation from 'pages/HoldingDepositAgreement/components/HoldingDepositAgreementConfirmation';

export const HoldingDepositAgreementPage = ({
    _prev,
    _nextRoute,
    configuration,
    profile,
    applicant,
    applicantUpdated,
}) => {
    const [currentPage, setCurrentPage] = useState('sign');

    useEffect(() => {
        const signedAgreement = !!profile.events.find(
            (e) => String(e.event) === String(APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED)
        );
        if (signedAgreement) {
            setCurrentPage('signed');
        }
    }, [profile]);

    useEffect(() => {
        hsclient.on('sign', async () => {
            const newApplicant = await API.fetchApplicant();
            const signedAgreement = newApplicant.events.find(
                (e) => parseInt(e.event) === parseInt(APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED)
            );
            if (!signedAgreement) {
                newApplicant.events.push({
                    event: APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED,
                    milestone: true,
                });
            }
            applicantUpdated(newApplicant);
            // holding deposit may not be ready by the time of navigation to the lease signed page
            setTimeout(() => setCurrentPage('signed'), 2500);
        });
        return () => {
            hsclient.off('sign');
        };
    }, [applicantUpdated]);

    const openEmbeddedSigning = async () => {
        const data = await API.embeddedSigningUrl(profile.id, DOCUMENT_TYPE_HOLDING_DEPOSIT);
        const url = data.url;
        const testMode = data.test_mode !== false;
        if (url) {
            hsclient.open(url, {
                testMode: testMode,
                skipDomainVerification: testMode,
                allowDecline: false,
                allowCancel: true,
            });
        }
    };

    const goNext = async () => {
        const newApplicant = await API.fetchApplicant();

        // HelloSign takes time to send a callback, this is to allow us to move forward
        const signedAgreement = newApplicant.events.find(
            (e) => parseInt(e.event) === APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED
        );
        if (!signedAgreement) {
            newApplicant.events.push({ event: APPLICANT_EVENTS.MILESTONE_HOLDING_DEPOSIT_SIGNED, milestone: true });
        }

        const finishedApplication = newApplicant.events.find(
            (e) => parseInt(e.event) === MILESTONE_APPLICANT_SUBMITTED
        );
        if (finishedApplication) return _nextRoute();

        // This is in case of a Holding deposit agreement reissue
        const finishedScreening = newApplicant.events.find((e) => parseInt(e.event) === EVENT_SCREENING_COMPLETED);

        if (finishedScreening) {
            newApplicant.events.push({ event: MILESTONE_APPLICANT_SUBMITTED, milestone: true });
        }

        return _nextRoute();
    };

    if (!profile || !applicant) return <div />;

    if (currentPage === 'signed') {
        return (
            <HoldingDepositAgreementConfirmation
                applicant={applicant}
                profile={profile}
                configuration={configuration}
                handleContinue={goNext}
                viewDocument={openEmbeddedSigning}
            />
        );
    } else {
        return (
            <HoldingDepositAgreementView
                applicant={applicant}
                profile={profile}
                configuration={configuration}
                handleContinue={openEmbeddedSigning}
                handleClickBack={_prev}
            />
        );
    }
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    profile: state.renterProfile,
    payables: state.payments,
    configuration: state.configuration,
});

const mapDispatchToProps = {
    applicantUpdated,
    fetchPayments,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRelativeRoutes(HoldingDepositAgreementPage, ROUTES.HOLDING_DEPOSIT_AGREEMENT));
