import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import Info from '@material-ui/icons/Info';

import PaidText from './PaidText';
import SimplePopover from 'components/common/SimplePopover';
import paymentWallet from 'assets/images/payment-wallet.png';
import { Card, CardSection, CardRow, P, H1, infoIconRoot } from 'assets/styles';
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

const AmountContainer = styled.div`
    width: 90px;
    text-align: left;
`

export const FeesDepositsOptions = ({configuration, goToPayment, _prev, profile, applicant, history}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');

    if (!configuration || !profile)  return <div/>;

    const applicantFeePaid = applicant.application_fee_paid;

    const otherApplicants = profile.primary_applicant.guarantors.concat(profile.co_applicants);

    const baseAppFee = configuration.application_fee;
    const unpaidApplicants = otherApplicants.filter(app => !app.application_fee_paid).length;

    const totalApplicationFee = applicationFeesSelected === 'self' ? 
        baseAppFee : 
        baseAppFee * (unpaidApplicants + 1);

    const holdingDepositAmount = configuration.holding_deposit_value ? configuration.holding_deposit_value : 0;
    
    const totalPaymentAmount = applicantFeePaid ?
        !profile.holding_deposit_paid && holdingDepositAmount :
        totalApplicationFee + ( !profile.holding_deposit_paid && holdingDepositAmount);

    const holdingDepositCopy = `The $${holdingDepositAmount} holding deposit takes your apartment off the market while the application process is happening. Our community requires the main applicant to pay the holding deposit.`;

    return (
        <Fragment>
            <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
            <SpacedImg src={paymentWallet} alt="wallet"/>
            <Card>
                <CardSection>
                    <ApplicationFees
                        totalApplicationFee={totalApplicationFee}
                        applicationFeesSelected={applicationFeesSelected}
                        handleChange={setApplicationFees}
                        otherApplicants={otherApplicants}
                        baseAppFee={baseAppFee}
                        applicantFeePaid={applicantFeePaid}
                        unpaidApplicants={unpaidApplicants}
                    />
                    {
                        !!holdingDepositAmount &&
                            <CardRow>
                                <P bold>
                                    Holding Deposit
                                    {" "}
                                    <SimplePopover text={holdingDepositCopy}>
                                        <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}} />
                                    </SimplePopover>
                                </P>
                                <AmountContainer>
                                    {   
                                        ( profile.holding_deposit_paid ? <PaidText/> : <P bold>{formatCurrency(holdingDepositAmount)}</P> )
                                    }
                                </AmountContainer>
                            </CardRow>
                    }
                    {   
                        ( ( !!holdingDepositAmount && !profile.holding_deposit_paid) || !applicantFeePaid ) &&
                            <CardRow>
                                <P bold color="#56BA82">Total</P>
                                <AmountContainer>
                                    <P bold color="#56BA82">{formatCurrency(totalPaymentAmount)}</P>
                                </AmountContainer>
                            </CardRow>
                    }
                </CardSection>
            </Card>
            <ActionButton onClick={goToPayment} marginTop={30} marginBottom={20}>Continue</ActionButton>
            <BackLink to={_prev}/>
        </Fragment>
    )
}



export default FeesDepositsOptions;
