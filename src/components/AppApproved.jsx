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
import { ROUTES, MILESTONE_LEASE_SENT, APPLICATION_EVENTS, DOCUMENT_TYPE_LEASE } from 'app/constants';
import approvedSign from 'assets/images/approvedSign.svg';
import { P, H1, leftText, SpacedH3, Bold, LinkButton } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import lightbulb from 'assets/images/lightbulb.png';
import { prettyCurrency } from 'utils/misc';
import { useEffect } from 'react';
import AppAdverseActions from 'components/AppAdverseActions';
import clsx from 'clsx';
import captureRoute from 'app/captureRoute';

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

export const AppApproved = ({ profile, configuration, history, applicantUpdated, applicant }) => {
    const [viewAdverseActions, setViewAdverseActions] = useState(false);
    useEffect(() => {
        hsclient.on('sign', async () => {
            // ensure FE has the applicant signed milestone before navigating to next screen
            const newApplicant = await API.fetchApplicant();
            const leaseSignedMilestone = newApplicant.events.find(
                e => parseInt(e.event) === parseInt(APPLICATION_EVENTS.MILESTONE_APPLICANT_SIGNED_LEASE)
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
        const url = data.url;
        const testMode = data.test_mode !== false;
        if (url) {
            hsclient.open(url, {
                testMode: testMode,
                skipDomainVerification: testMode,
                allowCancel: false,
                allowDecline: false,
            });
        }
    };

    const leaseSent = !!profile.events.find(e => String(e.event) === String(MILESTONE_LEASE_SENT));

    return (
        <>
            <div className={clsx({ 'hide-element': viewAdverseActions })}>
                <H1>{`You've Been Approved!`}</H1>
                {leaseSent && <SpacedH3>{`All that's left to do is sign the lease.`}</SpacedH3>}
                {!leaseSent && (
                    <SpacedH3>{`We'll send an email with instructions on how to sign the lease shortly.`}</SpacedH3>
                )}
                <ApprovedImage src={approvedSign} />
                <div id="application-unit" className={applicationUnit}>
                    {buildingName}
                    {unitNumber}
                </div>
                <div className={gridContainer}>
                    {securityDeposit && (
                        <Grid
                            classes={{ root: securityDepositTip }}
                            container
                            justify={'center'}
                            className="security-deposit-container"
                            marginTop={35}
                        >
                            <Grid item xs={2}>
                                <BulbImage alt="light bulb" src={lightbulb} />
                            </Grid>
                            <Grid item xs={9} classes={{ root: leftText }}>
                                <span className={securityDepositHelpText}>
                                    A{' '}
                                    <Bold fontSize={14} fontWeight={600}>
                                        {prettyCurrency(securityDeposit)} security deposit{' '}
                                    </Bold>
                                    is required for this application.&nbsp;
                                </span>
                                <LinkButton onClick={toggleViewAdverseActions}>Learn why</LinkButton>
                            </Grid>
                        </Grid>
                    )}
                    {leaseSent && (
                        <Box margin="28px 0 0 0">
                            <P textAlign="left" fontSize={12} color="#000000">
                                The lease linked below constitutes a legal agreement between you and Landlord. Nestio
                                does not provide legal advice, and we recommend that you consult your legal counsel
                                before accepting these terms.
                            </P>
                            <ActionButton onClick={openEmbeddedSigning} marginTop={30}>
                                Review &amp; Sign Lease
                            </ActionButton>
                        </Box>
                    )}
                </div>
            </div>
            {viewAdverseActions && (
                <AppAdverseActions
                    date={last_status_change.created_at}
                    buildingName={buildingName}
                    unitNumber={unitNumber}
                    name={name}
                    securityDeposit={prettyCurrency(securityDeposit)}
                    onAgree={toggleViewAdverseActions}
                />
            )}
        </>
    );
};

AppApproved.propTypes = {
    profile: PropTypes.object,
    configuration: PropTypes.object,
    updateApplicant: PropTypes.object,
    applicant: PropTypes.object,
    history: PropTypes.object,
    applicantUpdated: PropTypes.func,
};

const mapStateToProps = state => ({
    profile: state.renterProfile,
    applicant: state.applicant,
    configuration: state.configuration,
});

const mapDispatchToProps = {
    applicantUpdated,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(captureRoute(AppApproved, ROUTES.APP_APPROVED));
