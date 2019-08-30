import React, { Fragment } from 'react';
import styled from '@emotion/styled';

import { LINE_ITEM_TYPE_APPLICATION_FEE, LINE_ITEM_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import paymentWallet from 'assets/images/payment-wallet.png';
import receiptImage from 'assets/images/receipt.png';
import { Card, CardSection, CardRow, CardRowTotal, P, H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { formatCurrency } from 'utils/misc';
import { ApplicationFees } from './ApplicationFees';
import { HoldingDeposit } from './HoldingDeposit';



const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`

const SpacedImg = styled.img`
    margin: 15px 0;
`

export const FeesDepositsOptions = ({configuration, handleContinue, handleClickBack, profile, applicant, payments, receipt}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');

    if (!configuration || !profile )  return <div/>;

    const everyone = profile.primary_applicant.guarantors.concat(profile.co_applicants);
    everyone.unshift(applicant);
    const everyoneWithPaid = payments && everyone.map(person => {
        const applicationFeePaid = !!payments.find(payment => (
            ( parseInt(payment.applicant) === person.id || parseInt(payment.invitee) === person.id ) &&
            parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && 
            payment.paid
        ));
        return Object.assign({}, person, {applicationFeePaid})
    });

    const receiptPersonIds = receipt && receipt.line_items.map(item =>  (item.applicant || item.invitee) );
    debugger;
    const everyoneReceipt = receipt && everyone.filter(person => 
        !!receiptPersonIds.find(id => id === person.id)
    );
    
    const applicantFeePaid = everyoneWithPaid.find( person => person.id === applicant.id ).applicationFeePaid;
    const baseAppFee = configuration.application_fee;
    const unpaidApplicants = !receipt && payments.filter(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && !payment.paid)).length

    const totalApplicationFee = applicationFeesSelected === 'self' ? 
        baseAppFee : 
        baseAppFee * unpaidApplicants;

    const holdingDepositAmount = configuration.holding_deposit_value ? configuration.holding_deposit_value : 0;
    const holdingDepositPaid = !receipt && !!payments.find(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT && payment.paid))
    
    const totalPaymentAmount = applicantFeePaid ?
        !profile.holding_deposit_paid && holdingDepositAmount :
        totalApplicationFee + ( !holdingDepositPaid && holdingDepositAmount);

    const holdingDepositCopy = `The $${holdingDepositAmount} holding deposit takes your apartment off the market while the application process is happening. Our community requires the main applicant to pay the holding deposit.`;

    // receipt conditonal variables
    const mainHeader = receipt ?
        <Fragment>
            <SpacedH1>Payment Success!</SpacedH1>
            <SpacedH3>{`Thank you! We emailed a receipt to ${applicant.client.person.email}`}</SpacedH3>
        </Fragment> :
        <SpacedH1>Application Fees and Holding Deposit</SpacedH1>;

    const cardHeader = receipt ? 'Payment Summary' : 'Fees and Deposits';

    const image = receipt ? receiptImage : paymentWallet;
    const altText = receipt ? 'receipt' : 'wallet';

    const continueHandler = receipt ? handleContinue : () => handleContinue(applicationFeesSelected, totalPaymentAmount);
    return (
        <Fragment>
            { mainHeader }
            <SpacedImg src={image} alt={altText}/>
            <Card>
                <CardSection>
                    <CardRow>
                        <P bold>{cardHeader}</P>
                    </CardRow>
                    <ApplicationFees
                        totalApplicationFee={totalApplicationFee}
                        applicationFeesSelected={applicationFeesSelected}
                        handleChange={setApplicationFees}
                        everyone={receipt ? everyoneReceipt : everyoneWithPaid}
                        baseAppFee={baseAppFee}
                        applicantFeePaid={applicantFeePaid}
                        unpaidApplicants={unpaidApplicants}
                        receipt={!!receipt}
                    />
                    {
                        !!holdingDepositAmount && 
                            <HoldingDeposit
                                holdingDepositCopy={holdingDepositCopy}
                                holdingDepositPaid={holdingDepositPaid}
                                formatCurrency={formatCurrency}
                                holdingDepositAmount={holdingDepositAmount}  
                            />
                    }
                    {   
                        ( receipt || (!!holdingDepositAmount && !holdingDepositPaid) || !applicantFeePaid ) &&
                            <CardRowTotal>
                                <P bold>Total</P>
                                <div>
                                    <P bold>{formatCurrency(totalPaymentAmount, 0)}</P>
                                </div>
                            </CardRowTotal>
                    }
                </CardSection>
            </Card>
            <ActionButton onClick={continueHandler} marginTop={30} marginBottom={20}>Continue</ActionButton>
            { !receipt && <BackLink to={handleClickBack}/> }
        </Fragment>
    )
}

export default FeesDepositsOptions;
