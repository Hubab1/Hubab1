import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { LINE_ITEM_TYPE_APPLICATION_FEE, LINE_ITEM_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import paymentWallet from 'assets/images/payment-wallet.png';
import { Card, CardSection, CardRow, CardRowTotal, P, H1 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { prettyCurrency } from 'utils/misc';
import { ApplicationFees } from './ApplicationFees';
import { HoldingDeposit } from './HoldingDeposit';
import { css } from 'emotion';

const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`;

const SpacedImg = styled.img`
    margin: 15px 0;
`;

export const applicationUnit = css`
    color: #454b57;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    padding-bottom: 68px;
`;

export const FeesDepositsOptions = ({
    baseAppFee,
    holdingDepositAmount,
    handleContinue,
    handleClickBack,
    everyone,
    applicant,
    payments,
    unitNumber,
    communityName,
}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');
    if (!payments) return <div />;

    const applicationFeesPeople = everyone.map((person) => {
        const applicationFeePaid = !!payments.find(
            (payment) =>
                (parseInt(payment.applicant) === person.id || parseInt(payment.invitee) === person.id) &&
                parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE &&
                payment.paid
        );
        return Object.assign({}, person, { applicationFeePaid });
    });

    const activeApplicantFeePaid = applicationFeesPeople.find((person) => person.id === applicant.id)
        .applicationFeePaid;
    const numUnpaidApplicants = payments.filter(
        (payment) => parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && !payment.paid
    ).length;

    const totalApplicationFee = applicationFeesSelected === 'self' ? baseAppFee : baseAppFee * numUnpaidApplicants;

    const holdingDepositPaid = !!payments.find(
        (payment) => parseInt(payment.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT && payment.paid
    );

    const totalPaymentAmount = activeApplicantFeePaid
        ? !holdingDepositPaid && holdingDepositAmount
        : totalApplicationFee + (!holdingDepositPaid && holdingDepositAmount);

    return (
        <Fragment>
            <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
            <SpacedImg src={paymentWallet} alt={'wallet'} />
            <div className={applicationUnit}>{`${communityName} ${unitNumber}`}</div>
            <Card>
                <CardSection>
                    <CardRow>
                        <P bold>Fees and Deposits</P>
                    </CardRow>
                    <ApplicationFees
                        totalApplicationFee={totalApplicationFee}
                        applicationFeesSelected={applicationFeesSelected}
                        handleChange={setApplicationFees}
                        everyone={applicationFeesPeople}
                        baseAppFee={baseAppFee}
                        activeApplicantFeePaid={activeApplicantFeePaid}
                        numUnpaidApplicants={numUnpaidApplicants}
                    />
                    {!!holdingDepositAmount && (
                        <HoldingDeposit
                            holdingDepositPaid={holdingDepositPaid}
                            holdingDepositAmount={prettyCurrency(holdingDepositAmount)}
                        />
                    )}
                    {((!holdingDepositPaid && !!holdingDepositAmount) || !activeApplicantFeePaid) && (
                        <CardRowTotal>
                            <P bold>Total</P>
                            <div>
                                <P bold>{prettyCurrency(parseFloat(totalPaymentAmount))}</P>
                            </div>
                        </CardRowTotal>
                    )}
                </CardSection>
            </Card>
            <ActionButton
                onClick={() => handleContinue(applicationFeesSelected, totalPaymentAmount)}
                marginTop={30}
                marginBottom={20}
            >
                Continue
            </ActionButton>
            <BackLink to={handleClickBack} />
        </Fragment>
    );
};

FeesDepositsOptions.propTypes = {
    baseAppFee: PropTypes.number,
    holdingDepositAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // TODO: Fix this
    handleContinue: PropTypes.func,
    handleClickBack: PropTypes.string,
    everyone: PropTypes.array,
    applicant: PropTypes.object,
    payments: PropTypes.array,
    unitNumber: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
};

export default FeesDepositsOptions;
