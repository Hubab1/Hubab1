import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import Info from '@material-ui/icons/Info';

import PaidText from './PaidText';
import SimplePopover from 'components/common/SimplePopover';
import { LINE_ITEM_TYPE_APPLICATION_FEE, LINE_ITEM_TYPE_HOLDING_DEPOSIT } from 'app/constants';
import paymentWallet from 'assets/images/payment-wallet.png';
import receipt from 'assets/images/receipt.png';
import { Card, CardSection, CardRowBorderless, CardRow, CardRowTotal, P, H1, SpacedH3, infoIconRoot } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { formatCurrency } from 'utils/misc';
import { ApplicationFees } from './ApplicationFees';


const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`

const SpacedImg = styled.img`
    margin: 15px 0;
`

const CardRowBorderlessPadded = styled(CardRowBorderless)`
    padding: 15px 0;
`

export const FeesDepositsOptions = ({configuration, handleContinue, handleClickBack, profile, applicant, payments, receiptView=false}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');

    if (!configuration || !profile )  return <div/>;

    const everyone = profile.primary_applicant.guarantors.concat(profile.co_applicants);
    everyone.unshift(applicant);
    const everyoneWithPaid = everyone.map(person => {
        const applicationFeePaid = !!payments.find(payment => (
            ( parseInt(payment.applicant) === person.id || parseInt(payment.invitee) === person.id ) &&
            parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && 
            payment.paid
        ));
        return Object.assign({}, person, {applicationFeePaid})
    });

    
    const applicantFeePaid = everyoneWithPaid.find( person => person.id === applicant.id ).applicationFeePaid;
    const baseAppFee = configuration.application_fee;
    const unpaidApplicants = payments.filter(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_APPLICATION_FEE && !payment.paid)).length

    const totalApplicationFee = applicationFeesSelected === 'self' ? 
        baseAppFee : 
        baseAppFee * unpaidApplicants;

    const holdingDepositAmount = configuration.holding_deposit_value ? configuration.holding_deposit_value : 0;
    const holdingDepositPaid = !!payments.find(payment => (parseInt(payment.type) === LINE_ITEM_TYPE_HOLDING_DEPOSIT && payment.paid))
    
    const totalPaymentAmount = applicantFeePaid ?
        !profile.holding_deposit_paid && holdingDepositAmount :
        totalApplicationFee + ( !holdingDepositPaid && holdingDepositAmount);

    const holdingDepositCopy = `The $${holdingDepositAmount} holding deposit takes your apartment off the market while the application process is happening. Our community requires the main applicant to pay the holding deposit.`;

    const header = receiptView ? 
        <SpacedH3>{`Thank you! We emailed a receipt to ${applicant.client.person.email}`}</SpacedH3> :
        <SpacedH1>Application Fees and Holding Deposit</SpacedH1>;

    const image = receiptView ? receipt : paymentWallet;
    const altText = receiptView ? "receipt" : "wallet";

    const continueHandler = receiptView ? handleContinue : () => handleContinue(applicationFeesSelected, totalPaymentAmount);
    
    return (
        <Fragment>
            { header }
            <SpacedImg src={image} alt={altText}/>
            <Card>
                <CardSection>
                    <CardRow>
                        <P bold>Fees and Deposits</P>
                    </CardRow>
                    <ApplicationFees
                        totalApplicationFee={totalApplicationFee}
                        applicationFeesSelected={applicationFeesSelected}
                        handleChange={setApplicationFees}
                        everyone={everyoneWithPaid}
                        baseAppFee={baseAppFee}
                        applicantFeePaid={applicantFeePaid}
                        unpaidApplicants={unpaidApplicants}
                    />
                    {
                        !!holdingDepositAmount && 
                            <CardRowBorderlessPadded>
                                <P>
                                    Holding Deposit
                                    {" "}
                                    <SimplePopover text={holdingDepositCopy}>
                                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}} />
                                    </SimplePopover>
                                </P>
                                <div>
                                    {   
                                        ( holdingDepositPaid ? <PaidText/> : <P >{formatCurrency(holdingDepositAmount, 0)}</P> )
                                    }
                                </div>
                            </CardRowBorderlessPadded>
                    }
                    {   
                        ( ( !!holdingDepositAmount && !holdingDepositPaid) || !applicantFeePaid ) &&
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
            { !receiptView && <BackLink to={handleClickBack}/> }
        </Fragment>
    )
}

export default FeesDepositsOptions;
