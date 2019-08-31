import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from  'react-stripe-elements';
import Lock from '@material-ui/icons/Lock';

import ActionButton from 'components/common/ActionButton/ActionButton';
import StripeElementWrapper from './StripeElementWrapper';
import API, { MOCKY } from 'app/api';
import GenericFormError from 'components/common/GenericFormError';
import { formatCurrency } from 'utils/misc';
import mockReceipt from 'reducers/mock-receipt';


export class PaymentForm extends React.Component {
    state = { 
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
        submitting: false,
        errors: null
    }

    handleChangeUpdate = (changeObj) => {
        this.setState(prevState => Object.assign(prevState, {[changeObj.elementType]: changeObj.complete}))
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (MOCKY) {
            this.setState({submitting: false});
            return this.props.onSuccess(mockReceipt);
        }
        this.setState({submitting: true})
        const genericErrorMessage = 'There was an error processing your credit card. Please try again.';
        return this.props.stripe.createToken({type: 'card', name: 'client card'}).then( res => {
            if (res.token) {
                const data = {
                    token: res.token.id,
                    payables: this.props.payments,
                    total: this.props.totalPayment
                };
                API.stripePayment(data).then(res => {
                    if (res.errors) {
                        this.setState({errors: [res.errors.error.message], submitting: false});
                    } else {
                        this.setState({submitting: false});
                        // TODO: update this to read in the receipt payload when endpoint is ready
                        this.props.onSuccess(mockReceipt);
                    }
                });
            } else {
                this.setState({errors: [genericErrorMessage], submitting: false});        
            }
        }).catch( res => {
            this.setState({errors: [genericErrorMessage], submitting: false});        
        });
    }
    render() {
        const { cardNumber, cardExpiry, cardCvc, submitting } = this.state;
        return (
            <React.Fragment>
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
                >
                    <Lock style={{width: 16, marginRight: 8}}/>
                    { `Pay ${formatCurrency(this.props.totalPayment)}` }
                </ActionButton>
            </form>
            <button onClick={()=>this.handleSubmit({preventDefault:()=>{console.log('you clict')}})}>skip payment</button>
            </React.Fragment>
        )
    }
}

PaymentForm.propTypes = {
    onSuccess: PropTypes.func,
    totalPayment: PropTypes.number,
    payments: PropTypes.array
};

export default injectStripe(PaymentForm);