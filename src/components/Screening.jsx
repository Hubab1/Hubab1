import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import styled from '@emotion/styled';
import {css} from 'emotion';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
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
const checkboxText = css`
    font-size: 12px;
`

const centerText = css`
    text-align: center;
`

const noPaddingTop = css`
    padding-top: 0 !important;
`

const gridContainer = css`
    padding: 20px 0 20px 0;
`

const SocialSecurityPrompt = styled.form`
    [type="radio"]:checked,
    [type="radio"]:not(:checked) {
        position: absolute;
        left: -9999px;
    }
    [type="radio"]:checked + label,
    [type="radio"]:not(:checked) + label
    {
        position: relative;
        padding-left: 28px;
        cursor: pointer;
        line-height: 20px;
        display: inline-block;
        color: #666;
    }
    [type="radio"]:checked + label:before,
    [type="radio"]:not(:checked) + label:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 22px;
        border: 2px solid #26305B;
        border-radius: 100%;
        background: #fff;
        box-sizing: border-box;
    }
    [type="radio"]:checked + label:after,
    [type="radio"]:not(:checked) + label:after {
        content: '';
        width: 14px;
        height: 14px;
        background: #26305B;
        position: absolute;
        top: 4px;
        left: 4px;
        border-radius: 100%;
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
    }
    [type="radio"]:not(:checked) + label:after {
        opacity: 0;
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    [type="radio"]:checked + label:after {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    .prompt-label {
        height: 20px;
        width: 27px;
        color: #000000;
        font-size: 16px;
        line-height: 20px;
    }
    .prompt-choice {
        margin-right: 39px;
        
    }
    margin-bottom: 20px;
`


export class Screening extends React.Component {
    constructor() {
        super();
        this.state = {
            haveSocialSecurityNumber: true,
        };
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    onSubmit = (values, { setSubmitting, setErrors }) => {
        if (MOCKY) return this.props._nextRoute();
        if (!this.state.haveSocialSecurityNumber) {
            values.ssn = '000-00-0000';
        }
        values.have_ssn = this.state.haveSocialSecurityNumber;
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
    };

    handleOptionChange(changeEvent) {
        this.setState({
            haveSocialSecurityNumber: changeEvent.target.value === 'true',
        });
    }

    render () {
        const requestSocialSecurityNumber = this.state.haveSocialSecurityNumber;
        const initialValues = {
            haveSocialSecurityNumber: requestSocialSecurityNumber,
            ssn: null,
            disclaimer: false,
        };
        return (
            <Fragment
                enableReinitialize
                initialValues={initialValues}>
                <H1>You're almost done, {this.props.applicant.client.person.first_name}!</H1>
                <SpacedH3>To finish qualifying for this apartment, your Social Security number will be used for a background check.</SpacedH3>
                <img src={portfolioImg} alt="portfolio"></img>
                <br/>
                <br/>
                <Formik
                    onSubmit={this.onSubmit}
                    validationSchema={Yup.object().shape({
                        haveSocialSecurityNumber: Yup.boolean(),
                        // some test numbers are not valid and break some ssn rules. we may want to update with this more precise validation in the future /^(?!(000|666|9))\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/
                        ssn: Yup.string()
                            .when('haveSocialSecurityNumber', {
                                is: true,
                                then: Yup.string().required('Social Security Number is required')
                            }).matches(/^\d{3}-\d{2}-\d{4}$/, 'Must be a valid Social Security Number eg: 555-55-5555'),
                        disclaimer: Yup.string()
                            .required('You must click the checkbox to agree to the terms')
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
                                <SocialSecurityPrompt>
                                    <p className={securityBlurb}>Do you hae a social security number?</p>
                                    <span className="prompt-choice">
                                        <input
                                            type="radio"
                                            id="haveSSN"
                                            name="radio-group"
                                            value={true}
                                            defaultChecked={true}
                                            onChange={this.handleOptionChange}
                                        />
                                        <label htmlFor="haveSSN" className="prompt-label">Yes</label>
                                    </span>
                                    <span className="prompt-choice">
                                        <input
                                            type="radio"
                                            id="dontHaveSSN"
                                            name="radio-group"
                                            value={false}
                                            onChange={this.handleOptionChange}
                                        />
                                        <label htmlFor="dontHaveSSN" className="prompt-label">No</label>
                                    </span>
                                </SocialSecurityPrompt>
                                { requestSocialSecurityNumber && (
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
                                )}
                                <div className={gridContainer}>
                                    <Grid container spacing={0} alignItems="flex-start">
                                        <Grid item xs={2}>
                                            <Checkbox 
                                                name="disclaimer"
                                                onChange={handleChange}
                                                checked={values.disclaimer}
                                                value={values.disclaimer}
                                                error={errors.disclaimer}
                                                classes={{ root: noPaddingTop }}
                                            />
                                        </Grid>
                                        <Grid item xs={10}>
                                            <span className={checkboxText}>{`I understand that my personal information may be used to evaluate my eligibility for renting an apartment and I authorize ${this.props.buildingName} to request a consumer report.`}</span>
                                        </Grid>
                                    </Grid>
                                </div>
                                <ActionButton disabled={(!values.ssn && requestSocialSecurityNumber) || !values.disclaimer || isSubmitting} marginTop={31} marginBottom={20}>
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
    applicant: state.applicant,
    buildingName: state.configuration.community.building_name || state.configuration.community.normalized_street_address
})

export default connect(mapStateToProps)(withRelativeRoutes(Screening, ROUTES.SCREENING));
