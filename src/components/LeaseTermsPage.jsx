import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import {css} from 'emotion';
import styled from '@emotion/styled';
import { KeyboardDatePicker } from '@material-ui/pickers';

import { H1, SpacedH3 } from 'assets/styles';
import rent from 'assets/images/rent.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'app/constants';
import { selectors, updateRenterProfile } from 'reducers/renter-profile';
import withRelativeRoutes from 'app/withRelativeRoutes';


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
        this.props._nextRoute();
    }

    render () {
        return (
            <Fragment>
                <H1>Lease Terms</H1>
                <SpacedH3>Please select from the options below to move forward.</SpacedH3>
                <ImageContainer>
                    <img src={rent} alt="for rent sign"/>
                </ImageContainer>
                <Formik
                    onSubmit={this.onSubmit}
                    validationSchema={Yup.object().shape({
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