import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';
import Lock from '@material-ui/icons/Lock';

import ActionButton from 'components/common/ActionButton/ActionButton';
import StripeElementWrapper from './StripeElementWrapper';
import API, { MOCKY } from 'app/api';
import { fetchApplicant } from 'reducers/applicant';
import { fetchRenterProfile } from 'reducers/renter-profile';
import GenericFormMessage from 'components/common/GenericFormMessage';
import { prettyCurrency, prettyFormatPhoneNumber } from 'utils/misc';
import mockReceipt from 'reducers/mock-receipt';
import { P } from 'assets/styles';
import { ROUTES } from 'app/constants';
import { selectors as configSelectors } from 'reducers/configuration';
export const GENERIC_ERROR_MESSAGE = "Oops, we're having trouble processing your payment. Try again in a bit.";
export const CARD_DECLINE_ERROR_MESSAGE =
    "Oops, we're having trouble processing your payment because your card was declined. Please try a different card.";
export const UNIT_PMS_UNAVAILABLE_ERROR_MESSAGE = (contactPhone) =>
    "We're sorry but we were unable to process your payment at this time due to system issues unrelated to your " +
    `card. Please contact our Leasing Office at ${contactPhone} and an agent will be able to assist you.`;

export class PaymentForm extends React.Component {
    state = {
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
        submitting: false,
        errors: null,
    };

    handleChangeUpdate = (changeObj) => {
        this.setState((prevState) => Object.assign(prevState, { [changeObj.elementType]: changeObj.complete }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (MOCKY) {
            this.setState({ submitting: false });
            return this.props.onSuccess(mockReceipt);
        }
        this.setState({ submitting: true });
        return this.props.stripe
            .createToken({ type: 'card', name: 'client card' })
            .then((res) => {
                if (res.token) {
                    const data = {
                        token: res.token.id,
                        payables: this.props.payments,
                        total: this.props.totalPayment,
                    };
                    API.stripePayment(data)
                        .then((res) => {
                            if (res.errors) {
                                this.setState({
                                    errors: [this.getErrorMessage(res)],
                                    submitting: false,
                                });
                            } else {
                                this.setState({ submitting: false });
                                this.props.fetchApplicant();
                                this.props.fetchRenterProfile();
                                this.props.onSuccess(res);
                            }
                        })
                        .catch(() => {
                            this.setState({ errors: [GENERIC_ERROR_MESSAGE], submitting: false });
                        });
                } else {
                    this.setState({ errors: [GENERIC_ERROR_MESSAGE], submitting: false });
                }
            })
            .catch(() => {
                this.setState({ errors: [GENERIC_ERROR_MESSAGE], submitting: false });
            });
    };

    getErrorMessage(errorResponse) {
        if (errorResponse?.error_type === 'UnitPmsUnavailableError') {
            return UNIT_PMS_UNAVAILABLE_ERROR_MESSAGE(prettyFormatPhoneNumber(this.props.contactPhone));
        }

        // Stripe error types: https://stripe.com/docs/api/errors
        if (errorResponse?.errors?.error?.type === 'card_error') {
            // TODO: This is for troubleshooting only. Remove when better custom error messages.
            console.error(errorResponse?.errors?.message);
            // List of decline codes: https://stripe.com/docs/declines/codes
            return CARD_DECLINE_ERROR_MESSAGE;
        }

        return GENERIC_ERROR_MESSAGE;
    }

    render() {
        const { cardNumber, cardExpiry, cardCvc, submitting } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                {!!this.state.errors && <GenericFormMessage type="error" messages={this.state.errors} />}
                <Grid container justify="space-between">
                    <Grid item xs={12}>
                        <StripeElementWrapper
                            label="Credit/Debit Card Number"
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
                    Stripe and its affiliates will be processing this transaction for Funnel Leasing. Please see their{' '}
                    <Link to={ROUTES.TERMS} target="_blank">
                        terms of service
                    </Link>{' '}
                    for more information.
                </P>
                <ActionButton
                    marginTop={35}
                    marginBottom={20}
                    disabled={submitting || !cardNumber || !cardExpiry || !cardCvc}
                >
                    <Lock style={{ width: 16, marginRight: 8 }} />
                    {`Pay ${prettyCurrency(this.props.totalPayment)}`}
                </ActionButton>
            </form>
        );
    }
}

PaymentForm.propTypes = {
    onSuccess: PropTypes.func,
    totalPayment: PropTypes.number,
    payments: PropTypes.array,
    stripe: PropTypes.object,
    fetchApplicant: PropTypes.func,
    fetchRenterProfile: PropTypes.func,
    contactPhone: PropTypes.string,
};

const mapStateToProps = (state) => ({
    contactPhone: configSelectors.selectCommunityContactPhoneNumber(state),
});

const mapDispatchToProps = {
    fetchApplicant,
    fetchRenterProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(PaymentForm));
