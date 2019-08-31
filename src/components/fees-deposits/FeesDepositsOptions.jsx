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



    const baseAppFee = configuration.application_fee;
    const holdingDepositAmount = configuration.holding_deposit_value ? configuration.holding_deposit_value : 0;
    const everyone = profile.primary_applicant.guarantors.concat(profile.co_applicants);
    everyone.unshift(applicant);

    // payment logic
    let applicationFeesPeople = [];
    let activeApplicantFeePaid = false;
    let unpaidApplicants = 0;
    let totalApplicationFee = 0;
    let holdingDepositPaid = false;
    let showHoldingDeposit = !!holdingDepositAmount;
    let totalPaymentAmount = 0;

    // structural
    let mainHeader;
    let cardHeader;
    let image;
    let altText;
    let continueHandler

    
    if (payments) {
        applicationFeesPeople = everyone.map(person => {
            const applicationFeePaid = !!payments.find(payment => (
                ( parseInt(payment.applicant) === person.id || parseInt(payment.invitee) === person.id ) &&
                parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && 
                payment.paid
            ));
            return Object.assign({}, person, {applicationFeePaid})
        });
        
        activeApplicantFeePaid = applicationFeesPeople.find( person => person.id === applicant.id ).applicationFeePaid;
        unpaidApplicants = payments.filter(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && !payment.paid)).length;
        
        totalApplicationFee = applicationFeesSelected === 'self' ? 
            baseAppFee : 
            baseAppFee * unpaidApplicants;

        holdingDepositPaid = !!payments.find(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT && payment.paid))
        totalPaymentAmount = activeApplicantFeePaid ?
            !holdingDepositPaid && holdingDepositAmount :
            totalApplicationFee + ( !holdingDepositPaid && holdingDepositAmount);

        mainHeader = <SpacedH1>Application Fees and Holding Deposit</SpacedH1>;
        cardHeader = 'Fees and Deposits';
        image = paymentWallet;
        altText = 'wallet';
        continueHandler = () => handleContinue(applicationFeesSelected, totalPaymentAmount);


    } else if (receipt) {
        const receiptPersonIds = receipt.line_items.map(item =>  (item.applicant || item.invitee) );
        applicationFeesPeople = everyone.filter(person => 
            !!receiptPersonIds.find(id => parseInt(id) === person.id)
        );

        totalApplicationFee = baseAppFee * applicationFeesPeople.length;

        showHoldingDeposit = !!receipt.line_items.find(item => parseInt(item.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT)
        holdingDepositPaid = !!showHoldingDeposit
        totalPaymentAmount = receipt.total;

        mainHeader = <Fragment>
            <SpacedH1>Payment Success!</SpacedH1>
            <SpacedH3>{`Thank you! We emailed a receipt to ${applicant.client.person.email}`}</SpacedH3>
        </Fragment>;
        cardHeader = 'Payment Summary';
        image = receiptImage;
        altText = 'receipt';
        continueHandler = handleContinue;
    }

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
                        everyone={applicationFeesPeople}
                        baseAppFee={baseAppFee}
                        applicantFeePaid={activeApplicantFeePaid}
                        unpaidApplicants={unpaidApplicants}
                        receipt={!!receipt}
                    />
                    {
                        showHoldingDeposit && 
                            <HoldingDeposit
                                holdingDepositPaid={holdingDepositPaid}
                                formatCurrency={formatCurrency}
                                holdingDepositAmount={holdingDepositAmount}
                                receipt={!!receipt}
                            />
                    }
                    {   
                        (receipt || (!holdingDepositPaid && showHoldingDeposit)  || !activeApplicantFeePaid) &&
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
