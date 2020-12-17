import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { format, parseISO } from 'date-fns';

import { LEASE_TERMS_IDENTIFIER, ROLE_PRIMARY_APPLICANT, ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import { pageComplete, updateRenterProfile } from 'reducers/renter-profile';
import { parseDateISOString, serializeDate } from 'utils/misc';
import { prettyFormatPhoneNumber } from 'utils/misc';
import { H1, SpacedH3 } from 'assets/styles';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';
import AvailableLeaseTermsSelector from 'components/common/AvailableLeaseTermsSelector';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';
import rent from 'assets/images/rent.png';

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

function getMaxLeaseStartDate(daysOffset) {
    if (!daysOffset) {
        return undefined;
    }

    return moment().add({ days: daysOffset });
}

export const validationSchema = (acceptedLeaseStartDateRange) => {
    return Yup.object()
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
            lease_start_date: Yup.date()
                .nullable()
                .typeError('Invalid Date Format')
                .required('Select a Move In Date')
                .test(
                    'test-max-lease-start-date',
                    `Enter a date within ${acceptedLeaseStartDateRange} days of today`,
                    (leaseStartDate) => {
                        if (!acceptedLeaseStartDateRange || !leaseStartDate) {
                            return true;
                        }

                        const maxStartDate = getMaxLeaseStartDate(acceptedLeaseStartDateRange);
                        maxStartDate.endOf('day');

                        const startDate = moment(leaseStartDate);
                        startDate.startOf('day');

                        return startDate.isBefore(maxStartDate);
                    }
                ),
            unit: Yup.object().nullable().required('Select a Unit'),
            lease_term: Yup.mixed().nullable().required('Select a Lease Term'),
        });
};

export const LeaseTermsPage = ({
    application,
    isPrimaryApplicant,
    hasOutstandingBalance,
    config,
    updateRenterProfile,
    pageComplete,
    _nextRoute,
}) => {
    const [hasError, setHasError] = useState(false);
    const { community } = config;
    const { company } = community;
    const contactPhone = useMemo(() => prettyFormatPhoneNumber(community.contact_phone), [community]);

    const handleSubmit = useCallback(
        async (values, { setSubmitting, setErrors }) => {
            setSubmitting(true);

            if (!isPrimaryApplicant) {
                await pageComplete(LEASE_TERMS_IDENTIFIER);
                return _nextRoute();
            }

            try {
                const stateUpdate = Object.assign({}, values);
                stateUpdate.lease_start_date = serializeDate(stateUpdate.lease_start_date);

                const response = await updateRenterProfile(serializeValues(values), stateUpdate);
                if (response.errors) {
                    return setErrors(response.errors);
                }

                await pageComplete(LEASE_TERMS_IDENTIFIER);
                _nextRoute();
            } catch {
                setHasError(true);
            } finally {
                setSubmitting(false);
            }
        },
        [isPrimaryApplicant, updateRenterProfile, pageComplete, _nextRoute]
    );

    const initialValues = useMemo(() => {
        let lease_start_date = application.lease_start_date;
        if (lease_start_date) {
            lease_start_date = parseDateISOString(lease_start_date);
        }

        return {
            lease_start_date,
            lease_term: application.lease_term || '',
            unit: application.unit,
        };
    }, [application]);

    if (!application) {
        return null;
    }

    return (
        <>
            <H1>Lease Terms</H1>
            {isPrimaryApplicant && <SpacedH3>Please select from the options below to move forward.</SpacedH3>}
            {!isPrimaryApplicant && <SpacedH3>The options below have been selected for your application.</SpacedH3>}
            {hasError && (
                <GenericFormMessage
                    type="error"
                    messages={`Oops, we're having trouble calculating the pricing for your selections. Try selecting different terms, or call us at ${contactPhone} if this still isn’t working in a bit.`}
                />
            )}
            {!hasOutstandingBalance && (
                <GenericFormMessage
                    type="error"
                    messages={`Please call us at ${contactPhone} if you'd like to make any changes to your lease details.`}
                />
            )}
            <ImageContainer>
                <img src={rent} alt="for rent sign" />
            </ImageContainer>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema(company?.accepted_lease_start_date_range)}
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
                }) => {
                    return (
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
                                            disabled={!isPrimaryApplicant || !hasOutstandingBalance}
                                            onBlur={handleBlur}
                                            onChange={(value) => {
                                                setFieldValue('lease_start_date', value);
                                            }}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={submitCount >= 1 && !!errors.lease_start_date}
                                            helperText={submitCount >= 1 && errors.lease_start_date}
                                            minDate={getMinLeaseStartDate(values.unit)}
                                            maxDate={getMaxLeaseStartDate(company?.accepted_lease_start_date_range)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AvailableUnitsSelector
                                            application={application}
                                            update={(value) => {
                                                setFieldValue('unit', value);
                                                setFieldValue('lease_term', null);
                                            }}
                                            error={submitCount >= 1 && !!errors.unit}
                                            helperText={submitCount >= 1 && errors.unit}
                                            leaseStartDate={values.lease_start_date}
                                            errors={errors}
                                            disabled={!isPrimaryApplicant || !hasOutstandingBalance}
                                            value={values.unit}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AvailableLeaseTermsSelector
                                            unitId={values.unit?.id}
                                            leaseTerm={values.lease_term}
                                            handleChange={handleChange}
                                            disabled={!isPrimaryApplicant || !hasOutstandingBalance}
                                            leaseStartDate={values.lease_start_date}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            {values.unit && values.lease_start_date && values.lease_term && !errors.lease_start_date && (
                                <>
                                    <PriceBreakdown
                                        selectedOptions={{}}
                                        category={'lease_terms'}
                                        application={application}
                                        unitId={values.unit.id}
                                        moveInDate={values.lease_start_date}
                                        leaseTerm={values.lease_term}
                                        onError={() => setHasError(true)}
                                        onSuccess={() => setHasError(false)}
                                    />
                                    <div className={leasingPricingDisclaimer}>{config.leasing_pricing_disclaimer}</div>
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
                    );
                }}
            </Formik>
        </>
    );
};

LeaseTermsPage.propTypes = {
    isPrimaryApplicant: PropTypes.bool,
    hasOutstandingBalance: PropTypes.bool,
    application: PropTypes.object,
    config: PropTypes.object,
    pageComplete: PropTypes.func,
    updateRenterProfile: PropTypes.func,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    isPrimaryApplicant: state.applicant.role === ROLE_PRIMARY_APPLICANT,
    hasOutstandingBalance: state.applicant?.outstanding_balances?.length > 0,
    application: state.renterProfile,
    config: state.configuration,
});

const mapDispatchToProps = {
    updateRenterProfile,
    pageComplete,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));
