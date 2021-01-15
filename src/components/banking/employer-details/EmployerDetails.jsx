import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import API from 'app/api';
import { getShowAutomatedAddressForm } from 'selectors/launchDarkly';
import { H1, SpacedH3 } from 'assets/styles';
import portfolio from 'assets/images/portfolio_bag.png';
import EmployerAddressForm from 'components/banking/employer-details/EmployerAddressForm';
import BankingContext from 'components/banking/BankingContext';
import { fetchApplicant } from 'reducers/applicant';

import { ROUTES } from 'app/constants';
import BackLink from 'components/common/BackLink';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`;

export const GENERIC_ERROR_MESSAGE = 'Oops! We ran into some issues. Please try again later.';

export function EmployerDetails({ applicant, showAutomatedAddress, fetchApplicant }) {
    const [errors, setErrors] = useState(null);
    const context = React.useContext(BankingContext);

    const handleSubmit = (values, { setErrors: setFormErrors, setSubmitting }) => {
        setErrors(null);
        const employerInfo = { ...values };
        if (employerInfo.hasOwnProperty('search')) {
            delete employerInfo.search;
        }

        API.postEmployer(employerInfo)
            .then((res) => {
                if (res.errors) {
                    setFormErrors(res.errors);
                } else {
                    fetchApplicant();
                    context.history.push(ROUTES.FEES_AND_DEPOSITS);
                }
                setSubmitting(false);
            })
            .catch(() => {
                setErrors([GENERIC_ERROR_MESSAGE]);
                setSubmitting(false);
            });
    };

    if (!applicant) {
        return null;
    }

    return (
        <>
            <H1>Employer Details</H1>
            <SpacedH3>{`Tell us about your Employer. ${showAutomatedAddress ? '' : 'This is optional.'}`} </SpacedH3>
            <ImageContainer>
                <img src={portfolio} alt="Employer" />
            </ImageContainer>
            <EmployerAddressForm
                applicant={applicant}
                errors={errors}
                onSubmit={handleSubmit}
                showAutomatedAddress={showAutomatedAddress}
            />
            <BackLink to={ROUTES.INCOME_VERIFICATION_SUMMARY} />
        </>
    );
}

EmployerDetails.propTypes = {
    applicant: PropTypes.object,
    showAutomatedAddress: PropTypes.bool,
    fetchApplicant: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    showAutomatedAddress: getShowAutomatedAddressForm(state),
});

export default connect(mapStateToProps, { fetchApplicant })(EmployerDetails);
