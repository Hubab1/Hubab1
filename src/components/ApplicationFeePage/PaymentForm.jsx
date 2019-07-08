import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from  'react-stripe-elements';
import ActionButton from 'components/common/ActionButton/ActionButton';
import Lock from '@material-ui/icons/Lock';

import StripeElementWrapper from './StripeElementWrapper';
import API from 'app/api';
import { formatCurrency } from 'utils/misc';


export class PaymentForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.stripe.createToken({type: 'card', name: 'client card'}).then( res => {
                if (res.token) {
                    const data = {token: res.token.id};
                    API.stripePayment(data);
                } else {
                // some error
            }
        }).catch( res => {
            // omg more errors!
        });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <Grid container justify="space-between">
                    <Grid item xs={12}>
                        <StripeElementWrapper label="Credit Card Number" component={CardNumberElement} />
                    </Grid>
                    <Grid item xs={5}>
                        <StripeElementWrapper label="Expiration" component={CardExpiryElement} />
                    </Grid>
                    <Grid item xs={5}>
                        <StripeElementWrapper label="CVC" component={CardCVCElement} />
                    </Grid>
                </Grid>
                <ActionButton marginTop={25} marginBottom={20}>
                    <Lock style={{width: 16, marginRight: 8}}/>
                    {`Pay ${formatCurrency(this.props.applicationFee)}`}
                </ActionButton>
            </form>
        )
    }
}

PaymentForm.propTypes = {
    applicationFee: PropTypes.number,
};

export default injectStripe(PaymentForm);