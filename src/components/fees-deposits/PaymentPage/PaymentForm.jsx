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
import { selectors as profileSelectors } from 'reducers/renter-profile';
export const GENERIC_ERROR_MESSAGE = "Oops, we're having trouble processing your payment. Please try again in a bit.";
export const CARD_DECLINE_ERROR_MESSAGE =
    "Oops, we're having trouble processing your payment because your card was declined. Please try a different card.";
export const AVAILABILITY_ERROR_MESSAGE = (unit, contactPhone) =>
    `We’re having trouble verifying if ${unit ? `unit ${unit.unit_number}` : 'this unit'} is still available. Please ` +
    `try again in a bit. If you continue to see this error, please contact our Leasing Office at ${contactPhone} and ` +
    'an agent will be able to assist you.';
export const UNAVAILABLE_ERROR_MESSAGE = (unit, contactPhone) =>
    `Sorry, ${unit ? `unit ${unit.unit_number}` : 'this unit'} is no longer available. Call us at ${contactPhone} ` +
    'and we can help you find a similar one!';

export class PaymentForm extends React.Component {
    state = {
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
        submitting: false,
        errors: null,
        unitUnavailable: false,
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

        this.props.setDisableBack(true);
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
                        })
                        .finally(() => {
                            this.props.setDisableBack(false);
                        });
                } else {
                    this.setState({ errors: [GENERIC_ERROR_MESSAGE], submitting: false });
                    this.props.setDisableBack(false);
                }
            })
            .catch(() => {
                this.setState({ errors: [GENERIC_ERROR_MESSAGE], submitting: false });
                this.props.setDisableBack(false);
            });
    };

    getErrorMessage(errorResponse) {
        const errorType = errorResponse?.error_type;
        if (errorType === 'UnitPmsUnavailableError' || errorType === 'UnitTemporarilyUnavailableError') {
            return AVAILABILITY_ERROR_MESSAGE(this.props.unit, prettyFormatPhoneNumber(this.props.contactPhone));
        }

        if (errorType === 'UnitUnavailableError') {
            this.setState({ unitUnavailable: true });
            return UNAVAILABLE_ERROR_MESSAGE(this.props.unit, prettyFormatPhoneNumber(this.props.contactPhone));
        }

        // Stripe error types: https://stripe.com/docs/api/errors
        if (errorResponse?.errors?.error?.type === 'card_error') {
            // TODO: This is for troubleshooting only. Remove when better custom error messages. | created by: @Hasday | Ticket: NESTIO-19933
            console.error(errorResponse?.errors?.message);
            // List of decline codes: https://stripe.com/docs/declines/codes
            return CARD_DECLINE_ERROR_MESSAGE;
        }

        return GENERIC_ERROR_MESSAGE;
    }

    render() {
        const { cardNumber, cardExpiry, cardCvc, submitting, unitUnavailable } = this.state;
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
                    disabled={submitting || !cardNumber || !cardExpiry || !cardCvc || unitUnavailable}
                >
                    {submitting ? (
                        'Processing Payment...'
                    ) : (
                        <>
                            <Lock style={{ width: 16, marginRight: 8 }} />
                            {`Pay ${prettyCurrency(this.props.totalPayment)}`}
                        </>
                    )}
                </ActionButton>
            </form>
        );
    }
}

PaymentForm.propTypes = {
    totalPayment: PropTypes.number,
    payments: PropTypes.array,
    stripe: PropTypes.object,
    contactPhone: PropTypes.string,
    unit: PropTypes.object,
    onSuccess: PropTypes.func.isRequired,
    setDisableBack: PropTypes.func.isRequired,
    fetchApplicant: PropTypes.func.isRequired,
    fetchRenterProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    contactPhone: configSelectors.selectCommunityContactPhoneNumber(state),
    unit: profileSelectors.selectUnit(state),
});

const mapDispatchToProps = {
    fetchApplicant,
    fetchRenterProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectStripe(PaymentForm));
