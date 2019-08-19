import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import Info from '@material-ui/icons/Info';

import PaidText from './PaidText';
import SimplePopover from 'components/common/SimplePopover';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
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

export const FeesDeposits = ({configuration, _nextRoute, _prev, profile, applicant}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');

    if (!configuration || !profile)  return <div/>;

    const applicantFeePaid = applicant.application_fee_paid;

    const otherApplicants = profile.primary_applicant.guarantors.concat(profile.co_applicants);

    const baseAppFee = configuration.application_fee;
    const unpaidApplicants = otherApplicants.filter(app => !app.application_fee_paid).length + 1;
    const totalApplicationFee = applicationFeesSelected === 'self' ? baseAppFee : baseAppFee * unpaidApplicants;

    const holdingDepositAmount = configuration.holding_deposit_value ? configuration.holding_deposit_value : 0;
    
    const totalPaymentAmount = totalApplicationFee + ( !profile.holding_deposit_paid && holdingDepositAmount);

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
            <ActionButton onClick={_nextRoute} marginTop={30} marginBottom={20}>Continue</ActionButton>
            <BackLink to={_prev}/>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    configuration: state.configuration,
    profile: state.renterProfile,
    applicant: state.applicant,
});


export default connect(mapStateToProps)(withRelativeRoutes(FeesDeposits, ROUTES.FEES_AND_DEPOSITS));
