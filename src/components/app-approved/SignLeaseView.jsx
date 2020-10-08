import { arrowIcon, blackLinkRoot, H1, SpacedH3 } from 'assets/styles';
import { PaymentDetailsCard } from 'components/payment-details/PaymentDetailsCard';
import ActionButton from 'components/common/ActionButton/ActionButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import React, { useEffect } from 'react';
import hsclient from 'utils/hsclient';
import API from 'app/api';
import { APPLICATION_EVENTS, DOCUMENT_TYPE_LEASE, HELLOSIGN_TEST_MODE, ROUTES } from 'app/constants';
import PropTypes from 'prop-types';

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
                (e) => parseInt(e.event) === parseInt(APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE)
            );
            if (!leaseSignedMilestone) {
                newApplicant.events.push({
                    event: APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE,
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
    }, [applicantUpdated, history]);

    const openEmbeddedSigning = async () => {
        const data = await API.embeddedSigningUrl(DOCUMENT_TYPE_LEASE);
        if (data.url) {
            hsclient.open(data.url, {
                testMode: HELLOSIGN_TEST_MODE,
                skipDomainVerification: HELLOSIGN_TEST_MODE,
                allowCancel: false,
                allowDecline: false,
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
            <a href="#" className={blackLinkRoot} onClick={() => setShowPaymentDetails(false)}>
                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
            </a>
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
