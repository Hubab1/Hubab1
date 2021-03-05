import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';


import { APPLICANT_EVENTS, DOCUMENT_TYPE_LEASE, ROUTES } from 'constants/constants';
import hsclient from 'utils/hsclient';
import API from 'api/api';

import { PaymentDetailsCard } from 'components//PaymentDetails/PaymentDetailsCard/PaymentDetailsCard';
import ActionButton from 'components//ActionButton/ActionButton';
import { arrowIcon, blackLinkRoot, H1, LinkButton, SpacedH3 } from 'assets/styles';

export const SignLeaseView = ({
    payables,
    profile,
    setShowPaymentDetails,
    fetchPayments,
    history,
    applicantUpdated,
}) => {
    useEffect(() => {
        fetchPayments();

        hsclient.on('sign', async () => {
            // ensure FE has the applicant signed milestone before navigating to next screen
            const newApplicant = await API.fetchApplicant();
            const leaseSignedMilestone = newApplicant.events.find(
                (e) => parseInt(e.event) === parseInt(APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE)
            );
            if (!leaseSignedMilestone) {
                newApplicant.events.push({
                    event: APPLICANT_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE,
                    milestone: true,
                });
            }
            applicantUpdated(newApplicant);
            // lease may not be ready by the time of navigation to the lease signed page
            setTimeout(() => history.push(ROUTES.LEASE_SIGNED), 2500);
        });
        return () => {
            hsclient.off('sign');
        };
    }, [applicantUpdated, fetchPayments, history]);

    const openEmbeddedSigning = async () => {
        const data = await API.embeddedSigningUrl(DOCUMENT_TYPE_LEASE);
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

    return (
        <>
            <div>
                <H1>{`Payment Details`}</H1>
                <SpacedH3>{`Make sure everything looks good before signing the lease.`}</SpacedH3>
                <PaymentDetailsCard profile={profile} payables={payables} />
            </div>
            <ActionButton className="sign-lease" onClick={openEmbeddedSigning} marginTop={30}>
                View & Sign Lease
            </ActionButton>
            <br />
            <LinkButton className={blackLinkRoot} onClick={() => setShowPaymentDetails(false)}>
                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
            </LinkButton>
        </>
    );
};

SignLeaseView.propTypes = {
    applicantUpdated: PropTypes.func.isRequired,
    fetchPayments: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    payables: PropTypes.array.isRequired,
    setShowPaymentDetails: PropTypes.func.isRequired,
};
