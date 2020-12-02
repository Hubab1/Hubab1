import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import PropTypes from 'prop-types';
import { ROUTES, TOS_TYPE_PAYMENTS } from 'app/constants';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { Card, P, H1, LinkButton, ScrollableTermsCardSection, blackLinkRoot, arrowIcon } from 'assets/styles';
import captureRoute from 'app/captureRoute';
import { prettyCurrency } from 'utils/misc';
import moment from 'moment';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 15px 10%;
`;

const BodyP = styled(P)`
    font-size: 14px;
    margin: 0 0 12px 0;
`;

export const PaymentTerms = ({
    handleClickBack,
    goToPayment,
    holdingDepositAmount = 0,
    unitNumber,
    communityName,
    leaseStartDate,
    canProceedToPayment,
}) => {
    const moveInDate = moment(leaseStartDate).format('LL');
    const holdingDepositDisplayedAmount = prettyCurrency(holdingDepositAmount);

    const handleContinueClick = () => {
        const data = {
            type: TOS_TYPE_PAYMENTS,
            context: {
                time: Date.now(),
                move_in_date: moveInDate,
                holding_deposit: holdingDepositDisplayedAmount,
                community_name: communityName,
                unit_number: unitNumber,
            },
        };

        goToPayment(data);
    };

    return (
        <Fragment>
            <SpacedH1>Payment and Holding Deposit Terms</SpacedH1>
            <Card>
                <ScrollableTermsCardSection>
                    <BodyP>
                        Applicants will deposit with owner’s agent a holding deposit in the amount of{' '}
                        {holdingDepositDisplayedAmount} (“Holding Deposit”) for the residential unit {communityName}{' '}
                        Unit {unitNumber} (“Unit”), subject to the following conditions:
                    </BodyP>
                    <BodyP>
                        <b>1)</b> If accepted, the Holding Deposit shall be applied to the security deposit due at
                        move-in.
                    </BodyP>
                    <BodyP>
                        <b>2)</b> Applicants shall have{' '}
                        <b>
                            <u>24 hours</u>
                        </b>{' '}
                        following the date of this application to withdraw the application and receive full refund of
                        said Holding Deposit. If applicants cancel rental after 24 hours and was otherwise approved, the
                        holding deposit is forfeited.
                    </BodyP>
                    <BodyP>
                        <b>3)</b> Holding Deposit shall be fully refunded (not application fee) in case of denial of
                        application.
                    </BodyP>
                    <BodyP>
                        <b>4)</b> Applicants agree to take financial responsibility of the premises on{' '}
                        <b>
                            <u>{moveInDate}</u>
                        </b>{' '}
                        and pay the balance of rent and security deposits due on that date.
                    </BodyP>
                    <BodyP>
                        <b>5)</b> Applicants agree to provide proof of liability insurance and proof that Applicants
                        assumed obligations for utilities, as required by the Lease if applicable, by lease commencement
                        date.
                    </BodyP>
                    <BodyP>
                        <b>6)</b> If the Unit is not vacated by present resident on proposed move-out date and the
                        present resident is still in possession, the Holding Deposit will be returned in full to
                        Applicants. The Holding Deposit does not guarantee occupancy.
                    </BodyP>
                    <BodyP>
                        <b>7)</b> The Primary Applicant shall be responsible for depositing with owner’s Agent the
                        Holding Deposit. The Holding Deposit is applicable to all Applicants jointly. Any refund due
                        will be made payable the Primary Applicant and it shall be the responsibility of all Applicants
                        to work out between themselves the manner of dividing the Holding Deposit, if any.
                    </BodyP>
                    {canProceedToPayment && (
                        <BodyP>
                            <b>8)</b> By clicking “Agree and Continue”, you confirm that you have read the above Terms
                            and Conditions for the Holding deposit, that you understand them, and that you agree to be
                            bound by them.
                        </BodyP>
                    )}
                </ScrollableTermsCardSection>
            </Card>
            {!!handleClickBack && (
                <Fragment>
                    {canProceedToPayment ? (
                        <>
                            <ActionButton onClick={handleContinueClick} marginTop={25} marginBottom={20}>
                                Agree and Continue
                            </ActionButton>
                            <LinkButton className={blackLinkRoot} onClick={handleClickBack}>
                                <ArrowBackIos classes={{ root: arrowIcon }} /> Go Back
                            </LinkButton>
                        </>
                    ) : (
                        <ActionButton onClick={handleClickBack} marginTop={25} marginBottom={20}>
                            Go Back
                        </ActionButton>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

PaymentTerms.propTypes = {
    handleClickBack: PropTypes.func.isRequired,
    goToPayment: PropTypes.func,
    holdingDepositAmount: PropTypes.number.isRequired,
    unitNumber: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
    leaseStartDate: PropTypes.string.isRequired,
    canProceedToPayment: PropTypes.bool.isRequired,
};

export default captureRoute(PaymentTerms, ROUTES.PAYMENT_TERMS);
