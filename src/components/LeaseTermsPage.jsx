import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {css} from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { serializeDate, parseDateISOString } from 'utils/misc';
import { H1, SpacedH3 } from 'assets/styles';
import rent from 'assets/images/rent.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import withRelativeRoutes from 'app/withRelativeRoutes';
import AvailableUnitsSelector from 'components/common/AvailableUnitsSelector';


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

export class LeaseTermsPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        serialized.move_in_date = serializeDate(serialized.move_in_date);

        this.props._nextRoute();
        // uncomment when api is up to snuff
        // this.props.updateRenterProfile(serialized).then((res) => {
        //     if (res.errors) {
        //         setErrors(res.errors);
        //     } else {
        //         this.props._nextRoute();
        //     }
        //     setSubmitting(false);
        // });
    }

    initialValues () {
        const application = this.props.application;
        let move_in_date = application.move_in_date;
        if (move_in_date) {
            move_in_date = parseDateISOString(move_in_date);
        }
        return {
            move_in_date
        }
    }

    render () {
        if (!this.props.application || !this.props.config) return null;
        return (
            <Fragment>
                <H1>Lease Terms</H1>
                <SpacedH3>Please select from the options below to move forward.</SpacedH3>
                <ImageContainer>
                    <img src={rent} alt="for rent sign"/>
                </ImageContainer>
                <Formik
                    onSubmit={this.onSubmit}
                    initialValues={this.initialValues()}
                    validationSchema={Yup.object().shape({
                        move_in_date: Yup.string().nullable().required('Select a move in date'),
                        unit: Yup.string().nullable().required('Select a unit'),
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
                                            value={values.move_in_date || null}
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue('move_in_date', e)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                            error={submitCount >= 1 && !!errors.move_in_date}
                                            helperText={submitCount >= 1 && errors.move_in_date}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AvailableUnitsSelector
                                            update={val => setFieldValue('unit', val)}
                                            error={submitCount >= 1 && !!errors.unit}
                                            helperText={submitCount >= 1 && errors.unit}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="lease-term">Lease Term</InputLabel>
                                        <Select
                                            fullWidth
                                            value={values.employment_status}
                                            onChange={handleChange}
                                            inputProps={{
                                                name: 'lease_term',
                                                id: 'lease-term',
                                            }}
                                        >
                                            {this.props.config.rental_options_config.lease_term_choices.map(choice => (
                                                <MenuItem value={choice}>{choice} Months</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </div>
                            <ActionButton marginTop={31} marginBottom={20}>
                                    Continue
                            </ActionButton>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

export default connect((state) => ({application: state.renterProfile, config: state.configuration}), {updateRenterProfile})(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));