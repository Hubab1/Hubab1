import React, { useState } from 'react';
import styled from '@emotion/styled';
import Grid from '@material-ui/core/Grid';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';

import { applicantUpdated } from 'reducers/applicant';
import API from 'app/api';
import hsclient from 'utils/hsclient';
import { ROUTES, HELLOSIGN_TEST_MODE, APPLICATION_EVENTS, DOCUMENT_TYPE_LEASE } from 'app/constants';
import { H1, SpacedH3, blackLinkRoot, arrowIcon } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { useEffect } from 'react';
import AppAdverseActions from 'components/AppAdverseActions';
import clsx from 'clsx';
import captureRoute from 'app/captureRoute';
import { fetchPayments } from 'reducers/payments';
import { PaymentDetailsCard } from 'components/payment-details/PaymentDetailsCard';
import { Link } from 'react-router-dom';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

export const ApprovedImage = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const applicationUnit = css`
    color: #454b57;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding-top: 10px;
`;

export const BulbImage = styled.img`
    width: 46px;
    height: 42px;
`;

export const securityDepositHelpText = css`
    color: #454b57;
    font-size: 14px;
    line-height: 17px;
    text-align: left;
`;

export const gridContainer = css`
    min-height: 100px;
`;
export const securityDepositTip = css`
    margin-top: 28px;
`;

export const SignLease = ({ profile, configuration, history, applicantUpdated, applicant, payables }) => {
    const [viewAdverseActions, setViewAdverseActions] = useState(false);

    console.log('OK1');

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

    if (!profile || !configuration) return null;

    const { unit, last_status_change, security_deposit: securityDeposit } = profile;
    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = !!unit && !!unit.unit_number ? ` Unit ${unit.unit_number}` : '';
    const { name } = applicant.client.person;

    const toggleViewAdverseActions = () => {
        setViewAdverseActions(!viewAdverseActions);
    };

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
            <div className={clsx({ 'hide-element': viewAdverseActions })}>
                <H1>{`Payment Details`}</H1>
                <SpacedH3>{`Make sure everything looks good before signing the lease.`}</SpacedH3>
                <PaymentDetailsCard profile={profile} payables={payables} />
            </div>
            <ActionButton onClick={openEmbeddedSigning} marginTop={30}>
                View & Sign Lease
            </ActionButton>
            <br />
            <Link to={ROUTES.APP_APPROVED} className={blackLinkRoot}>
                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
            </Link>
        </>
    );
};

SignLease.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    updateApplicant: PropTypes.object,
    applicant: PropTypes.object,
    history: PropTypes.object,
    applicantUpdated: PropTypes.func,
    payables: PropTypes.array,
};

const mapStateToProps = (state) => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
    payables: state.payments || [],
});

const mapDispatchToProps = {
    applicantUpdated,
    fetchPayments,
};

export default connect(mapStateToProps, mapDispatchToProps)(captureRoute(SignLease, ROUTES.APP_APPROVED));
