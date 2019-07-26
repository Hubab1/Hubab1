import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import styled from '@emotion/styled';
import {css} from 'emotion';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import * as Yup from 'yup';

import { ROUTES } from 'app/constants';
import { H1, SpacedH3 } from 'assets/styles';
import withRelativeRoutes from 'app/withRelativeRoutes';
import ActionButton from 'components/common/ActionButton/ActionButton';
import portfolioImg from 'assets/images/portfolio.png';
import SocialSecurityInput from 'components/common/SocialSecurityInput';
import API, { MOCKY } from 'app/api';

import ssl from 'assets/images/ssl-image.png';

const Image = styled.img`
    width: 91px;
    height: 32px;
`

const securityBlurb = css`
    color: #828796;
    font-size: 13px;
`

const centerText = css`
    text-align: center;
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`

export class FinalDetails extends React.Component {
    onSubmit = (values, { setSubmitting, setErrors }) => {
        if (MOCKY) return this.props._nextRoute();
        API.postPassthrough(values).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                this.props._nextRoute();
            }
            setSubmitting(false);
        }).catch(() => {
            setSubmitting(false);
        })
    }

    render () {
        if (!this.props.profile) return null;

        return (
            <Fragment>
                <H1>You're almost done, {this.props.profile.primary_applicant.first_name}!</H1>
                <SpacedH3>To finish qualifying for this apartment, your Social Security number will be used for a background check.</SpacedH3>
                <img src={portfolioImg} alt="portfolio"></img>
                <br/>
                <br/>
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
                            <FormControl fullWidth>
                                <InputLabel htmlFor="employment-status">Select Your Employement Status</InputLabel>
                                <Select
                                    value={values.employment_status}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: 'employment_status',
                                        id: 'employment-status',
                                    }}
                                >
                                    <MenuItem value={1}>Employed</MenuItem>
                                    <MenuItem value={2}>Student</MenuItem>
                                    <MenuItem value={3}>Retired</MenuItem>
                                    <MenuItem value={4}>Other</MenuItem>
                                </Select>
                                <br/>
                                <SocialSecurityInput
                                    name="ssn"
                                    setFieldValue={(val) => setFieldValue('ssn', val)}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    value={values.ssn}
                                    error={errors.ssn}
                                    submitted={ submitCount > 0 }
                                    helperText={submitCount > 0 ? errors.ssn && 'Invalid' : null}
                                />
                                <div className={gridContainer}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item xs={4} classes={{ root: centerText }}>
                                            <Image alt="ssl secured" src={ssl} />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <span className={securityBlurb}>We use industry leading encryption software to secure your data</span>
                                        </Grid>
                                    </Grid>
                                </div>
                                <ActionButton disabled={!values.ssn || !values.employment_status || isSubmitting} marginTop={31} marginBottom={20}>
                                    Submit
                                </ActionButton>
                            </FormControl>
                        </form>
                    )}
                </Formik>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.renterProfile
})

export default connect(mapStateToProps)(withRelativeRoutes(FinalDetails, ROUTES.FINAL_DETAILS));
