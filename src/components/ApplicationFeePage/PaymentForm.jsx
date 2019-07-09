import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Elements, CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from  'react-stripe-elements';
import ActionButton from 'components/common/ActionButton/ActionButton';
import Lock from '@material-ui/icons/Lock';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

import StripeElementWrapper from './StripeElementWrapper';
import API from 'app/api';
import { ROUTES } from 'app/constants';
import GenericFormError from 'components/common/GenericFormError';
import { formatCurrency } from 'utils/misc';


export class PaymentForm extends React.Component {
    state = { 
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
        paymentSuccess: false,
        submitting: false,
        errors: null
    }

    handleChangeUpdate = (changeObj) => {
        this.setState(prevState => Object.assign(prevState, {[changeObj.elementType]: changeObj.complete}))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({submitting: true})
        const genericErrorMessage = 'There was an error processing your credit card. Please try again.';
        this.props.stripe.createToken({type: 'card', name: 'client card'}).then( res => {
            if (res.token) {
                const data = {token: res.token.id};
                API.stripePayment(data).then(res => {
                    if (res.errors) {
                        this.setState({errors: [res.errors.error.message], subitting: false});
                    } else {
                        this.setState(
                            {paymentSuccess:true},
                            () => setTimeout(() => this.props.history.push(ROUTES.CONNECT_BANK), 3000)
                        ); 
                    }
                });
            } else {
                this.setState({errors: [genericErrorMessage], subitting: false});        
            }
        }).catch( res => {
            this.setState({errors: [genericErrorMessage], subitting: false});        
        });
    }
    render() {
        const { cardNumber, cardExpiry, cardCvc, paymentSuccess, submitting } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                {!!this.state.errors && <GenericFormError errors={this.state.errors}/>}
                <Grid container justify="space-between">
                    <Grid item xs={12}>
                        <StripeElementWrapper 
                            label="Credit Card Number" 
                            component={CardNumberElement} 
                            handleChangeUpdate={this.handleChangeUpdate}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <StripeElementWrapper
                            label="Expiration"
                            component={CardExpiryElement}
                            handleChangeUpdate={this.handleChangeUpdate}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <StripeElementWrapper
                            label="CVC"
                            component={CardCVCElement}
                            handleChangeUpdate={this.handleChangeUpdate}
                        />
                    </Grid>
                </Grid>
                <ActionButton 
                    marginTop={25}
                    marginBottom={20}
                    disabled={submitting || !cardNumber || !cardExpiry || !cardCvc}
                    successGreen={paymentSuccess}
                >
                    { 
                        paymentSuccess ? 
                        <CheckCircleRoundedIcon style={{width: 16, marginRight: 8}} /> : 
                        <Lock style={{width: 16, marginRight: 8}}/>
                    }
                    {
                        paymentSuccess ?
                        'Payment Success!' :
                        `Pay ${formatCurrency(this.props.applicationFee)}`}
                </ActionButton>
            </form>
        )
    }
}

PaymentForm.propTypes = {
    applicationFee: PropTypes.number,
};

export default injectStripe(PaymentForm);