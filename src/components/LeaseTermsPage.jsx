import styled from '@emotion/styled';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { LEASE_TERMS_IDENTIFIER, ROLE_PRIMARY_APPLICANT, ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import rent from 'assets/images/rent.png';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';
import PriceBreakdown from 'components/profile/options/PriceBreakdown';
import { css } from 'emotion';
import { Formik } from 'formik';
import moment from 'moment';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { pageComplete, updateRenterProfile } from 'reducers/renter-profile';

import { offsetDate, parseDateISOString, serializeDate } from 'utils/misc';
import * as Yup from 'yup';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 136px;
        max-width: 136px;
    }
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`

export const DATE_FORMAT = 'MM/DD/YYYY';

function serializeValues(values) {
    const serialized = Object.assign({}, values);
    serialized.unit_id = serialized.unit.id;
    serialized.lease_start_date = serializeDate(serialized.lease_start_date);
    delete serialized.unit;
    return serialized;
}

export const leaseTermsValidationSchema = Yup.object().test(
    'is-unit-available-for-date', 'An error has occurred',
    function(values) {
        const { createError } = this;
        const { unit, lease_start_date } = values;

        if (!lease_start_date || !unit || !unit.date_available) {
            return true;
        }

        const start_date = moment(lease_start_date, 'MM/DD/YYYY', true);
        if (!start_date.isValid()) {
            return true;
        }

        const date_available = moment(unit.date_available)
        if (start_date >= date_available) {
            return true;
        }

        return createError({
            path: 'lease_start_date',
            message: `Oops! Unit ${ unit.unit_number } isn’t available until ${ date_available.format('M/D/YY') }`,
        });
    }
).shape({
    lease_start_date: Yup.string().nullable().test(
        'is-valid-date', 'Invalid date', value => !value || moment(value, DATE_FORMAT, true).isValid()
    ).test(
        'is-after-today', 'Move In Date must be on or after today',
        value => !value || moment(value, DATE_FORMAT, true).startOf('day') >= moment().startOf('day')
    ).required('Select a Move In Date'),
    unit: Yup.object().nullable().required('Select a Unit'),
    lease_term: Yup.number().nullable().required('Select a Lease Term'),
});

export class LeaseTermsPage extends React.Component {
    state = {confirmSent: false, errors: null};

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
        } finally {
            setSubmitting(false);
        }
    }

    initialValues () {
        const application = this.props.application;
        let lease_start_date = application.lease_start_date;
        if (lease_start_date) {
            lease_start_date = parseDateISOString(lease_start_date);
        }
        return {
            lease_start_date,
            lease_term: application.lease_term,
            unit: application.unit
        }
    }

    getLeaseEndDateText = (lease_start_date, lease_term) => {
        // TODO: Need to validate that the entered start date is correct
        if (!lease_start_date || !lease_term) {
            return "";
        }

        if (!moment(lease_start_date, true).isValid()) {
            return "";
        }

        return `Ends ${offsetDate(lease_start_date, lease_term)}`;
    }

    getMinLeaseStartDate = (unit) => {
        const today = moment().startOf('day');
        const dateAvailable = (unit && unit.date_available) ? moment(unit.date_available) : null;

        if (dateAvailable) {
            return moment.max(today, dateAvailable);
        } else {
            return today;
        }
    }


    render () {
        if (!this.props.application) return null;
        const { isPrimaryApplicant } = this.props;
        return (
            <Fragment>
                <H1>Lease Terms</H1>
                {isPrimaryApplicant && <SpacedH3>Please select from the options below to move forward.</SpacedH3>}
                {!isPrimaryApplicant && <SpacedH3>The options below have been selected for your application.</SpacedH3>}
                <ImageContainer>
                    <img src={rent} alt="for rent sign"/>
                </ImageContainer>
                <Formik
                    onSubmit={this.onSubmit}
                    initialValues={this.initialValues()}
                    validationSchema={leaseTermsValidationSchema}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        submitCount,
                        isSubmitting,
                        setFieldValue,
                        errors
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
                                            onChange={e => setFieldValue('lease_start_date', e)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={submitCount >= 1 && !!errors.lease_start_date}
                                            helperText={submitCount >= 1 && errors.lease_start_date}
                                            minDate={this.getMinLeaseStartDate(values.unit)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AvailableUnitsSelector
                                            update={val => setFieldValue('unit', val)}
                                            error={submitCount >= 1 && !!errors.unit}
                                            helperText={submitCount >= 1 && errors.unit}
                                            errors={errors}
                                            disabled={!isPrimaryApplicant}
                                            initialValue={values.unit}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="lease-term">Lease Term</InputLabel>
                                            <Select
                                                fullWidth
                                                value={values.lease_term}
                                                onChange={handleChange}
                                                disabled={!isPrimaryApplicant}
                                                inputProps={{
                                                    name: 'lease_term',
                                                    id: 'lease-term',
                                                }}
                                            >
                                                {this.props.config.lease_term_options.map(choice => (
                                                    <MenuItem key={choice} value={choice}>{choice} Months</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>{this.getLeaseEndDateText(values.lease_start_date, values.lease_term)}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                            {
                                values.unit &&
                                values.lease_start_date &&
                                values.lease_term &&
                                !errors.lease_start_date && (
                                    <PriceBreakdown
                                        selectedOptions={{}}
                                        application={this.props.application}
                                        unitId={values.unit.id}
                                        category={"lease_terms"}
                                        moveInDate={values.lease_start_date}
                                        leaseTerm={values.lease_term}
                                    />
                                )
                            }
                            <ActionButton disabled={!values.lease_start_date || !values.unit || !values.lease_term || isSubmitting} marginTop={31} marginBottom={20}>
                                Continue
                            </ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

export default connect((state) => ({
    isPrimaryApplicant: state.applicant.role === ROLE_PRIMARY_APPLICANT,
    application: state.renterProfile,
    config: state.configuration,
}),
{
    updateRenterProfile,
    pageComplete,
})(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));
