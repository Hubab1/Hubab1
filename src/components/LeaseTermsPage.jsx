import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {css} from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';

import Tip from 'components/common/Tip';
import { formatCurrency } from 'utils/misc';
import { serializeDate, parseDateISOString } from 'utils/misc';
import { H1, P, SpacedH3 } from 'assets/styles';
import rent from 'assets/images/rent.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import withRelativeRoutes from 'app/withRelativeRoutes';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';
import { offsetDate } from 'utils/misc';
import { ROLE_PRIMARY_APPLICANT } from 'app/constants';



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

function serializeValues(values) {
    const serialized = Object.assign({}, values);
    serialized.unit_id = serialized.unit.id;
    serialized.lease_start_date = serializeDate(serialized.lease_start_date);
    delete serialized.unit;
    return serialized;
}

export class LeaseTermsPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        if (!this.props.isPrimaryApplicant) return this.props._nextRoute();

        const stateUpdate = Object.assign({}, values);
        stateUpdate.lease_start_date = serializeDate(stateUpdate.lease_start_date);

        return this.props.updateRenterProfile(serializeValues(values), stateUpdate).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                this.props._nextRoute();
            }
            setSubmitting(false);
        });
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
                    validationSchema={Yup.object().shape({
                        lease_start_date: Yup.string().nullable().required('Select a move in date'),
                        unit: Yup.object().nullable().required('Select a Unit'),
                        lease_term: Yup.number().nullable().required('Select a lease term'),
                    })}
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
                                            <FormHelperText>{values.lease_start_date && values.lease_term && `Ends ${offsetDate(values.lease_start_date, values.lease_term)}`}</FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </div>
                            {
                                values.unit && (
                                    <Tip
                                        header="Monthly Rent"
                                        text={
                                            <P>Based on your selection, your rent will be <b>{formatCurrency(values.unit.price)}/month.</b></P>
                                        }
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
    updateRenterProfile
})(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));