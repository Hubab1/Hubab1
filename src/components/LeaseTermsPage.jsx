import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { format, parseISO } from 'date-fns';

import GenericFormMessage from 'components/common/GenericFormMessage';
import { LEASE_TERMS_IDENTIFIER, ROLE_PRIMARY_APPLICANT, ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import rent from 'assets/images/rent.png';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';
import AvailableLeaseTermsSelector from 'components/common/AvailableLeaseTermsSelector';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';
import { pageComplete, updateRenterProfile } from 'reducers/renter-profile';
import { parseDateISOString, serializeDate } from 'utils/misc';
import { prettyFormatPhoneNumber } from 'utils/misc';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 136px;
        max-width: 136px;
    }
`;

const gridContainer = css`
    padding: 20px 0 20px 0;
`;

const leasingPricingDisclaimer = css`
    margin-top: 37px;
    font-size: 12px;
`;

function serializeValues(values) {
    const serialized = Object.assign({}, values);
    serialized.unit_id = serialized.unit.id;
    serialized.lease_start_date = serializeDate(serialized.lease_start_date);
    delete serialized.unit;
    return serialized;
}

function getMinLeaseStartDate(unit) {
    const today = Date.now();
    const dateAvailable = unit?.date_available ? parseISO(unit.date_available) : null;

    if (!dateAvailable || today > dateAvailable) {
        return new Date(today).setHours(0, 0, 0, 0);
    } else {
        return dateAvailable;
    }
}

export const leaseTermsValidationSchema = Yup.object()
    .test('is-unit-available-for-date', 'An error has occurred', function (values) {
        const { createError } = this;
        const { unit, lease_start_date } = values;

        if (!lease_start_date) {
            return true;
        }

        const start_date = Date.parse(lease_start_date);
        const min_available = getMinLeaseStartDate(unit);
        if (new Date(start_date) < min_available) {
            const unitNumber = unit ? unit.unit_number : '';
            return createError({
                path: 'lease_start_date',
                message: `Oops! Unit ${unitNumber} isn’t available until ${format(min_available, 'M/d/yy')}`,
            });
        }

        return true;
    })
    .shape({
        lease_start_date: Yup.date().nullable().typeError('Invalid Date Format').required('Select a Move In Date'),
        unit: Yup.object().nullable().required('Select a Unit'),
        lease_term: Yup.mixed().nullable().required('Select a Lease Term'),
    });

export class LeaseTermsPage extends React.Component {
    state = { confirmSent: false, errors: null };

    onSubmit = async (values, { setSubmitting, setErrors }) => {
        const stateUpdate = Object.assign({}, values);
        stateUpdate.lease_start_date = serializeDate(stateUpdate.lease_start_date);
        setSubmitting(true);
        try {
            let errors;
            if (this.props.isPrimaryApplicant) {
                const renterProfileRes = await this.props.updateRenterProfile(serializeValues(values), stateUpdate);
                errors = renterProfileRes.errors;
            }
            if (errors) {
                setErrors(errors);
            } else {
                await this.props.pageComplete(LEASE_TERMS_IDENTIFIER);
                this.props._nextRoute();
            }
        } catch {
            this.setState({ hasError: true });
        } finally {
            setSubmitting(false);
        }
    };

    initialValues() {
        const application = this.props.application;
        let lease_start_date = application.lease_start_date;
        if (lease_start_date) {
            lease_start_date = parseDateISOString(lease_start_date);
        }
        return {
            lease_start_date,
            lease_term: application.lease_term || '',
            unit: application.unit,
        };
    }

    render() {
        if (!this.props.application) return null;
        const { isPrimaryApplicant } = this.props;

        return (
            <Fragment>
                <H1>Lease Terms</H1>
                {isPrimaryApplicant && <SpacedH3>Please select from the options below to move forward.</SpacedH3>}
                {!isPrimaryApplicant && <SpacedH3>The options below have been selected for your application.</SpacedH3>}
                {this.state.hasError && (
                    <GenericFormMessage
                        type="error"
                        messages={`Oops, we're having trouble calculating the pricing for your selections. Try selecting different terms, or call us at ${prettyFormatPhoneNumber(
                            this.props.config.community.contact_phone
                        )} if this still isn’t working in a bit.`}
                    />
                )}
                <ImageContainer>
                    <img src={rent} alt="for rent sign" />
                </ImageContainer>
                <Formik
                    onSubmit={this.onSubmit}
                    initialValues={this.initialValues()}
                    validationSchema={leaseTermsValidationSchema}
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        submitCount,
                        isSubmitting,
                        setFieldValue,
                    }) => (
                        <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                            <div className={gridContainer}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <KeyboardDatePicker
                                            id="move-in-date"
                                            clearable
                                            disablePast
                                            format="MM/dd/yyyy"
                                            placeholder="mm/dd/yyyy"
                                            label="Move In Date"
                                            value={values.lease_start_date || null}
                                            fullWidth
                                            disabled={!isPrimaryApplicant}
                                            onBlur={handleBlur}
                                            onChange={(value) => {
                                                setFieldValue('lease_start_date', value);
                                                setFieldValue('unit', null);
                                                setFieldValue('lease_term', null);
                                            }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={submitCount >= 1 && !!errors.lease_start_date}
                                            helperText={submitCount >= 1 && errors.lease_start_date}
                                            minDate={getMinLeaseStartDate(values.unit)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AvailableUnitsSelector
                                            application={this.props.application}
                                            update={(value) => {
                                                setFieldValue('unit', value);
                                                setFieldValue('lease_term', null);
                                            }}
                                            error={submitCount >= 1 && !!errors.unit}
                                            helperText={submitCount >= 1 && errors.unit}
                                            errors={errors}
                                            disabled={!isPrimaryApplicant}
                                            value={values.unit}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AvailableLeaseTermsSelector
                                            unitId={values.unit?.id}
                                            leaseTerm={values.lease_term}
                                            handleChange={handleChange}
                                            isPrimaryApplicant={isPrimaryApplicant}
                                            leaseStartDate={values.lease_start_date}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            {values.unit && values.lease_start_date && values.lease_term && !errors.lease_start_date && (
                                <>
                                    <PriceBreakdown
                                        selectedOptions={{}}
                                        application={this.props.application}
                                        unitId={values.unit.id}
                                        category={'lease_terms'}
                                        moveInDate={values.lease_start_date}
                                        leaseTerm={values.lease_term}
                                        onError={() => this.setState({ hasError: true })}
                                        onSuccess={() => this.setState({ hasError: false })}
                                    />
                                    <div className={leasingPricingDisclaimer}>
                                        {this.props.config.leasing_pricing_disclaimer}
                                    </div>
                                </>
                            )}
                            <ActionButton
                                disabled={
                                    !values.lease_start_date || !values.unit || !values.lease_term || isSubmitting
                                }
                                marginTop={31}
                                marginBottom={20}
                            >
                                Continue
                            </ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

LeaseTermsPage.propTypes = {
    isPrimaryApplicant: PropTypes.bool,
    application: PropTypes.object,
    config: PropTypes.object,
    pageComplete: PropTypes.func,
    updateRenterProfile: PropTypes.func,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    isPrimaryApplicant: state.applicant.role === ROLE_PRIMARY_APPLICANT,
    application: state.renterProfile,
    config: state.configuration,
});

const mapDispatchToProps = {
    updateRenterProfile,
    pageComplete,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));
