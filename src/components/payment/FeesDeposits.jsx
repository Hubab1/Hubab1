import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import paymentWallet from 'assets/images/payment-wallet.png';
import { Card, CardSection, CardRow, P, H1 } from 'assets/styles';
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

export const FeesDeposits = ({configuration, _nextRoute, _prev, profile}) => {
    const [applicationFeesSelected, setApplicationFees] = React.useState('self');

    if (!configuration || !profile)  return <div/>;

    const otherApplicants = profile.primary_applicant.guarantors.concat(profile.co_applicants);

    const baseAppFee = configuration.application_fee;
    const totalApplicationFee = applicationFeesSelected === 'self' ? baseAppFee : baseAppFee * (otherApplicants.length+1);

    const holdingDepositAmount = (configuration.holding_deposit_value && !profile.paid_deposit) ? configuration.holding_deposit_value : 0;
    
    const totalPaymentAmount = totalApplicationFee + holdingDepositAmount;
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
                    />
                    {   
                        holdingDepositAmount > 0 &&
                            <CardRow>
                                <P bold>Holding Deposit</P>
                                <P bold>{formatCurrency(holdingDepositAmount)}</P>
                            </CardRow>
                    }
                    <CardRow>
                        <P bold color="#56BA82">Total</P>
                        <P bold color="#56BA82">{formatCurrency(totalPaymentAmount)}</P>
                    </CardRow>
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
});


export default connect(mapStateToProps)(withRelativeRoutes(FeesDeposits, ROUTES.FEES_AND_DEPOSITS));
