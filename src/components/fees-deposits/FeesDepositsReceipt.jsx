import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { LINE_ITEM_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import receiptImage from 'assets/images/receipt.png';
import { Card, CardSection, CardRow, CardRowTotal, P, H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { prettyCurrency } from 'utils/misc';
import { ApplicationFees } from './ApplicationFees';
import { HoldingDeposit } from './HoldingDeposit';



const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`;

const SpacedImg = styled.img`
    margin: 15px 0;
`;

export const FeesDepositsReceipt = ({baseAppFee, handleContinue, everyone, email, receipt, paidByAnother}) => {
    if (!receipt) return <div/>;
    const holdingDepositEntry = receipt.line_items.find(item => parseInt(item.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT);
    const holdingDepositAmount = !!holdingDepositEntry && holdingDepositEntry.amount ? holdingDepositEntry.amount : 0;

    const receiptPersonIds = new Set(receipt.line_items.map(item =>  parseInt(item.applicant || item.invitee) ));
    const applicationFeesPeople = everyone.filter(person => !!receiptPersonIds.has(person.id));

    const totalApplicationFee = baseAppFee * applicationFeesPeople.length;

    const descriptionText = paidByAnother ? 'Your roommates have paid all the application fees!' : `Thank you! We emailed a receipt to ${email}`;
    return (
        <Fragment>
            <SpacedH1>Payment Successful!</SpacedH1>
            <SpacedH3>{descriptionText}</SpacedH3>
            <SpacedImg src={receiptImage} alt="receipt"/>
            <Card>
                <CardSection>
                    <CardRow>
                        <P bold>Payment Summary</P>
                    </CardRow>
                    <ApplicationFees
                        totalApplicationFee={totalApplicationFee}
                        everyone={applicationFeesPeople}
                        baseAppFee={baseAppFee}
                        activeApplicantFeePaid={paidByAnother}
                    />
                    {
                        !!holdingDepositAmount &&
                            <HoldingDeposit
                                holdingDepositAmount={prettyCurrency(holdingDepositAmount)}
                                holdingDepositPaid={paidByAnother}
                            />
                    }
                    {
                        !paidByAnother &&
                            <CardRowTotal>
                                <P bold>Total</P>
                                <div>
                                    <P bold>{prettyCurrency(receipt.total)}</P>
                                </div>
                            </CardRowTotal>
                    }
                </CardSection>
            </Card>
            <ActionButton onClick={handleContinue} marginTop={30} marginBottom={20}>Continue</ActionButton>
        </Fragment>
    );
};

export default FeesDepositsReceipt;
