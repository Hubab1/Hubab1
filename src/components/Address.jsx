import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styled from '@emotion/styled';

import { ROUTES } from 'app/constants';
import { updateApplicant } from 'reducers/applicant';
import withRelativeRoutes from 'app/withRelativeRoutes';
import FormTextInput from 'components/common/FormTextInput/FormTextInput';
import { H1, SpacedH3 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import sticky from 'assets/images/sticky.png';
import { allValuesSet } from 'utils/formik';
import { STATE_ZIP_CODES } from 'constants/zipcodes';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`;

const validationSchema = Yup.object().shape({
    address_street: Yup.string()
        .required('required')
        .matches(/^[A-Za-z0-9]+(?:\s[A-Za-z0-9'_-]+)+$/, 'Invalid street'),
    address_line_2: Yup.string(),
    address_city: Yup.string()
        .required('required')
        .matches(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/, 'Invalid city'),
    address_state: Yup.string().required('required'),
    address_postal_code: Yup.string()
        .test('test-postal-code-exists', 'Unknown zip', function (postalCode) {
            const postalCodeRange = STATE_ZIP_CODES.find((s) => {
                return postalCode >= s.zipCodeMin && postalCode <= s.zipCodeMax;
            });

            return !!postalCodeRange;
        })
        .test('test-postal-code-belongs-to-state', 'Zip does not belong to state', function (postalCode) {
            const { address_state } = this.parent;

            const postalCodeRange = STATE_ZIP_CODES.find((s) => {
                return postalCode >= s.zipCodeMin && postalCode <= s.zipCodeMax;
            });

            if (!postalCodeRange || !address_state) {
                return false;
            }

            return (
                address_state.toLowerCase() === postalCodeRange.state.toLowerCase() ||
                address_state.toLowerCase() === postalCodeRange.stateAbbrv.toLowerCase()
            );
        })
        .required('required'),
});

export class Address extends React.Component {
    onSubmit = (values, { setSubmitting, setErrors }) => {
        const serialized = Object.assign({}, values);
        this.props.updateApplicant(serialized).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
            } else {
                this.props._nextRoute();
            }
            setSubmitting(false);
        });
    };

    initialValues() {
        const applicant = this.props.applicant;
        return {
            address_street: applicant.address_street,
            address_line_2: applicant.address_line_2,
            address_city: applicant.address_city,
            address_state: applicant.address_state,
            address_postal_code: applicant.address_postal_code,
        };
    }

    render() {
        if (!this.props.applicant) return null;
        return (
            <Fragment>
                <H1>Tell Us A Little More</H1>
                <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
                <ImageContainer>
                    <img src={sticky} alt="sticky note" />
                </ImageContainer>
                <Formik
                    validationSchema={validationSchema}
                    initialValues={this.initialValues()}
                    onSubmit={this.onSubmit}
                >
                    {({ values, errors, handleChange, submitCount, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={1}>
                                <Grid item xs={9}>
                                    <FormTextInput
                                        label="Street Address"
                                        name="address_street"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_street}
                                        value={values.address_street}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextInput
                                        label="Apt/Ste/Floor"
                                        name="address_line_2"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_line_2}
                                        value={values.address_line_2}
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <FormTextInput
                                        label="City"
                                        name="address_city"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_city}
                                        value={values.address_city}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextInput
                                        label="State"
                                        name="address_state"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_state}
                                        value={values.address_state}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormTextInput
                                        label="Zip"
                                        name="address_postal_code"
                                        submitted={submitCount > 0}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        error={errors.address_postal_code}
                                        value={values.address_postal_code}
                                    />
                                </Grid>
                            </Grid>
                            <ActionButton
                                marginTop={50}
                                disabled={!allValuesSet(values, { exclude: ['address_line_2'] }) || isSubmitting}
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

Address.propTypes = {
    updateApplicant: PropTypes.func.isRequired,
    applicant: PropTypes.object,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
});

export default connect(mapStateToProps, { updateApplicant })(withRelativeRoutes(Address, ROUTES.ADDRESS));
