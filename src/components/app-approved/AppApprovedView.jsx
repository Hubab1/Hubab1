import clsx from 'clsx';
import { Bold, H1, leftText, P, SpacedH3 } from 'assets/styles';
import approvedSign from 'assets/images/approvedSign.svg';
import Grid from '@material-ui/core/Grid';
import lightbulb from 'assets/images/lightbulb.png';
import { prettyCurrency } from 'utils/misc';
import Box from '@material-ui/core/Box';
import ActionButton from 'components/common/ActionButton/ActionButton';
import React from 'react';
import { MILESTONE_LEASE_SENT, ROLE_OCCUPANT } from 'app/constants';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { AdverseActionNoticeButton, LINK_BUTTON } from 'components/AdverseActionNoticeButton';

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

export const aanDocButton = css`
    outline: none;
`;

export const AppApprovedView = ({ profile, configuration, applicant, setShowPaymentDetails }) => {
    const { unit, security_deposit: securityDeposit } = profile;

    const buildingName = configuration.community.building_name || configuration.community.normalized_street_address;
    const unitNumber = !!unit && !!unit.unit_number ? ` Unit ${unit.unit_number}` : '';

    const leaseSent = !!profile.events.find((e) => String(e.event) === String(MILESTONE_LEASE_SENT));
    const isOccupant = applicant.role === ROLE_OCCUPANT;

    let subtitle;
    if (isOccupant) {
        subtitle = `We'll let you know when everything has been finalized.`;
    } else if (leaseSent) {
        subtitle = `All that's left to do is review your payment details and sign the lease.`;
    } else {
        subtitle = `We'll send an email with instructions on how to sign the lease shortly.`;
    }

    return (
        <>
            <div className={clsx({ 'hide-element': false })}>
                <H1>{`You've Been Approved!`}</H1>
                <SpacedH3>{subtitle}</SpacedH3>
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
                                <AdverseActionNoticeButton componentType={LINK_BUTTON} />
                            </Grid>
                        </Grid>
                    )}
                    {!isOccupant && leaseSent && (
                        <Box margin="28px 0 0 0">
                            <P textAlign="left" fontSize={12} color="#000000">
                                The lease linked below constitutes a legal agreement between you and Landlord. Funnel
                                Leasing does not provide legal advice, and we recommend that you consult your legal
                                counsel before accepting these terms.
                            </P>
                            <ActionButton
                                className="show-payments"
                                onClick={() => setShowPaymentDetails(true)}
                                marginTop={30}
                            >
                                Continue
                            </ActionButton>
                        </Box>
                    )}
                </div>
            </div>
        </>
    );
};

AppApprovedView.propTypes = {
    applicant: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    setShowPaymentDetails: PropTypes.func.isRequired,
};
