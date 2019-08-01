import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import {css} from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { H1, SpacedH3 } from 'assets/styles';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import API from 'app/api';
import withRelativeRoutes from 'app/withRelativeRoutes';


const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 90px;
        max-width: 90px;
    }
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`

export class LeaseTermsPage extends React.Component {
    state = {confirmSent: false, errors: null};

    onSubmit = (values, { setSubmitting, setErrors }) => {
        API.inviteGuarantor({guarantors: [values]}).then((res) => {
            setSubmitting(false);
            this.setState({confirmSent: true})
        }).catch((res) => {
            this.setState({errors: [res.errors]});
            setSubmitting(false);
        });
    }

    render () {
        return (
            <Fragment>
                <H1>Lease Terms</H1>
                <SpacedH3>Please select from the options below to move forward.</SpacedH3>
                <Formik
                    onSubmit={this.onSubmit}
                    validationSchema={Yup.object().shape({
                        ssn: Yup.string()
                            .required('Phone Number is required')
                            .matches(/^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/, 'Must be a valid Social Security Number eg: 555-55-5555')
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
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs={6}>
                                        <KeyboardDatePicker
                                            id="move-in-date"
                                            clearable
                                            disableFuture
                                            format="MM/dd/yyyy"
                                            placeholder="mm/dd/yyyy"
                                            label="Move In Date"
                                            value={values.birthday || null}
                                            fullWidth
                                            onBlur={handleBlur}
                                            onChange={e => setFieldValue('move_in_date', e)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
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

export default connect((state) => ({routes: selectors.selectOrderedRoutes(state)}), {updateRenterProfile})(withRelativeRoutes(LeaseTermsPage, ROUTES.LEASE_TERMS));