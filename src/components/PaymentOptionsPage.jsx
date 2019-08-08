import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';

import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import paymentWallet from 'assets/images/payment-wallet.png';
import { Card, CardSection, H1, P } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import { formatCurrency } from 'utils/misc';


const SpacedH1 = styled(H1)`
    margin: 15px 10% 0 10%;
`

const SpacedImg = styled.img`
    margin: 15px 0;
`

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #EEEEEE;
    padding-bottom: 5px;
`

export class PaymentOptionsPage extends React.Component {

    render () {
        if (!this.props.configuration) return <div/>;
        return (
            <Fragment>
                <SpacedH1>Application Fees and Holding Deposit</SpacedH1>
                <SpacedImg src={paymentWallet} alt="wallet"/>
                <Card>
                    <CardSection>
                        <CardHeader>
                            <P bold>Application Fee</P>
                            <P bold>{formatCurrency(this.props.configuration.application_fee)}</P>
                        </CardHeader>
                    </CardSection>
                </Card>
                <ActionButton onClick={this.props._nextRoute} marginTop={30} marginBottom={20}>Continue</ActionButton>
                <BackLink to={this.props._prev}/>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    configuration: state.configuration,
});


export default connect(mapStateToProps)(withRelativeRoutes(PaymentOptionsPage, ROUTES.PAYMENT_OPTIONS));
