import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';

import { ROUTES } from 'app/constants';
import { getShowAutomatedAddressForm } from 'selectors/launchDarkly';
import { updateApplicant } from 'reducers/applicant';
import withRelativeRoutes from 'app/withRelativeRoutes';
import AddressForm from 'components/common/AddressForm/AddressForm';
import { H1, SpacedH3 } from 'assets/styles';
import sticky from 'assets/images/sticky.png';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 105px;
        max-width: 114px;
    }
`;

export const GENERIC_ERROR_MESSAGE = 'Oops! We ran into some issues. Please try again later.';

export const Address = ({ applicant, updateApplicant, _nextRoute, showAutomatedAddress }) => {
    const [errors, setErrors] = useState(null);

    const handleSubmit = useCallback(
        async (values, { setErrors: setFormErrors, setSubmitting }) => {
            setErrors(null);

            try {
                const response = await updateApplicant(values);
                if (response.errors) {
                    setFormErrors(response.errors);
                } else {
                    _nextRoute();
                }
            } catch {
                setErrors([GENERIC_ERROR_MESSAGE]);
            } finally {
                setSubmitting(false);
            }
        },
        [updateApplicant, _nextRoute, setErrors]
    );

    if (!applicant) {
        return null;
    }

    return (
        <>
            <H1>Tell Us A Little More</H1>
            <SpacedH3>Now, by filling out these details below we can screen you more accurately.</SpacedH3>
            <ImageContainer>
                <img src={sticky} alt="sticky note" />
            </ImageContainer>
            <AddressForm
                applicant={applicant}
                errors={errors}
                onSubmit={handleSubmit}
                showAutomatedAddress={showAutomatedAddress}
            />
        </>
    );
};

Address.propTypes = {
    applicant: PropTypes.object,
    showAutomatedAddress: PropTypes.bool,
    updateApplicant: PropTypes.func.isRequired,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    showAutomatedAddress: getShowAutomatedAddressForm(state),
});

const mapActionsToProps = {
    updateApplicant,
};

export default connect(mapStateToProps, mapActionsToProps)(withRelativeRoutes(Address, ROUTES.ADDRESS));
