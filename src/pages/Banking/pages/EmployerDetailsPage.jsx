import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import { APPLICANT_EVENTS, MILESTONE_APPLICANT_SUBMITTED, ROUTES } from 'constants/constants';
import API from 'api/api';
import { getShowAutomatedAddressForm } from 'selectors/launchDarkly';
import { fetchApplicant } from 'reducers/applicant';

import BackLink from 'common-components/BackLink/BackLink';
import BankingContext from 'pages/Banking/BankingContext';
import EmployerAddressForm from 'pages/Banking/components/EmployerAddressForm';
import { H1, SpacedH3 } from 'assets/styles';
import portfolio from 'assets/images/portfolio_bag.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`;

export const GENERIC_ERROR_MESSAGE = 'Oops! We ran into some issues. Please try again later.';

export function EmployerDetailsPage({ applicant, showAutomatedAddress, fetchApplicant, configuration }) {
    const context = useContext(BankingContext);
    const [errors, setErrors] = useState(null);

    const updatesWereRequested = !!applicant.events?.find(
        (e) =>
            String(e.event) ===
            String(APPLICANT_EVENTS.EVENT_FINANCIAL_STREAM_ADDITIONAL_DOCUMENTS_REQUESTED_EMAIL_SENT)
    );

    const applicantSubmittedApplication = !!applicant.events?.find(
        (e) => String(e.event) === String(MILESTONE_APPLICANT_SUBMITTED)
    );

    const handleSubmit = (values, { setErrors: setFormErrors, setSubmitting }) => {
        setErrors(null);
        const employerInfo = { ...values };
        if (employerInfo.hasOwnProperty('search')) {
            delete employerInfo.search;
        }

        context.toggleLoader(true);

        API.postEmployer(employerInfo)
            .then((res) => {
                if (res.errors) {
                    setFormErrors(res.errors);
                } else {
                    fetchApplicant();
                    if (updatesWereRequested || applicantSubmittedApplication) {
                        context._nextRoute();
                        return;
                    }
                    context.history.push(ROUTES.FEES_AND_DEPOSITS);
                }
            })
            .catch(() => {
                setErrors([GENERIC_ERROR_MESSAGE]);
            })
            .finally(() => {
                context.toggleLoader(false);
                setSubmitting(false);
            });
    };

    if (!applicant) {
        return null;
    }

    return (
        <>
            <H1>Employer Details</H1>
            <SpacedH3>Tell us about your employer.</SpacedH3>
            <ImageContainer>
                <img src={portfolio} alt="Employer" />
            </ImageContainer>
            <EmployerAddressForm
                applicant={applicant}
                errors={errors}
                onSubmit={handleSubmit}
                showAutomatedAddress={showAutomatedAddress}
            />
            {configuration.enable_automatic_income_verification ? (
                <BackLink to={ROUTES.INCOME_VERIFICATION_SUMMARY} />
            ) : (
                <BackLink to={ROUTES.PROFILE_OPTIONS} />
            )}
        </>
    );
}

EmployerDetailsPage.propTypes = {
    applicant: PropTypes.object,
    configuration: PropTypes.object,
    showAutomatedAddress: PropTypes.bool,
    fetchApplicant: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    showAutomatedAddress: getShowAutomatedAddressForm(state),
    configuration: state.configuration,
});

const mapDispatchToProps = {
    fetchApplicant,
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployerDetailsPage);
