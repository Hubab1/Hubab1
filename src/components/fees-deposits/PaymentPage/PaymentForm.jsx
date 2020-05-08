import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from  'react-stripe-elements';
import Lock from '@material-ui/icons/Lock';

import ActionButton from 'components/common/ActionButton/ActionButton';
import StripeElementWrapper from './StripeElementWrapper';
import API, { MOCKY } from 'app/api';
import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';
import GenericFormMessage from 'components/common/GenericFormMessage';
import { prettyCurrency } from 'utils/misc';
import mockReceipt from 'reducers/mock-receipt';
import { P } from 'assets/styles';
import { ROUTES } from 'app/constants';


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
                        if (res.errors.error) {
                            this.setState({errors: [res.errors.error.message], submitting: false});
                        } else {
                            this.setState({errors: ["There was an error with your payment submission. Please try again."], submitting: false});
                        }
                    } else {
                        this.setState({submitting: false});
                        this.props.fetchApplicant();
                        this.props.fetchRenterProfile();
                        this.props.onSuccess(res);
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
            <form onSubmit={this.handleSubmit}>
                {!!this.state.errors && <GenericFormMessage type="error" messages={this.state.errors}/>}
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
                <P textAlign="left" fontSize={12} margin="37px 0 0 0" color="#000000">
                    Stripe and its affiliates will be processing this transaction for Nestio.
                    Please see Nestio's <Link to={ROUTES.TERMS} target="_blank">terms of service</Link> for more information.
                </P>
                <ActionButton 
                    marginTop={35}
                    marginBottom={20}
                    disabled={submitting || !cardNumber || !cardExpiry || !cardCvc}
                >
                    <Lock style={{width: 16, marginRight: 8}}/>
                    { `Pay ${prettyCurrency(this.props.totalPayment)}` }
                </ActionButton>
            </form>
        )
    }
}

PaymentForm.propTypes = {
    onSuccess: PropTypes.func,
    totalPayment: PropTypes.number,
    payments: PropTypes.array
};

export default connect(null, {fetchApplicant,  fetchRenterProfile})(injectStripe(PaymentForm));
