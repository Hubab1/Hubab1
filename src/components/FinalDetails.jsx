import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, SpacedH3 } from 'assets/styles';
import portfolioImg from 'assets/images/portfolio.png';
import SocialSecurityInput from 'components/common/SocialSecurityInput';

export class FinalDetails extends React.Component {
    onSubmit = () => {

    }

    render () {
        if (!this.props.profile) return null;

        return (
            <Fragment>
                <H1>You're almost done, {this.props.profile.primary_applicant.first_name}!</H1>
                <SpacedH3>To finish qualifying for this apartment, your Social Security number will be used for a background check.</SpacedH3>
                <img src={portfolioImg} alt="portfolio"></img>
                <Formik
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        submitCount,
                        errors
                    }) => (
                        <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                            <FormControl fullWidth>
                                <InputLabel htmlFor="employment-status">Select Your Employement Status</InputLabel>
                                <Select
                                    value={values.employment}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: 'employment',
                                        id: 'employment-status',
                                    }}
                                >
                                    <MenuItem value="employed">Employed</MenuItem>
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="retired">Retired</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                                <br/>
                                <SocialSecurityInput
                                    name="ssn"
                                    value={values.ssn}
                                    handleChange={handleChange}
                                    error={errors.ssn}
                                />
                                <ActionButton disabled={!values.ssn || !values.employment || values.ssn === '___-__-____'} marginTop={31} marginBottom={20}>
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

export default connect(mapStateToProps)(FinalDetails);
