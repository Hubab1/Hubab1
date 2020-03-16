import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';

import Tip from 'components/common/Tip';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import ItemAdder from 'components/common/ItemAdder';
import storageImage from 'assets/images/storage.png';
import { H1, SpacedH3, P } from 'assets/styles';
import { ROUTES, RENTER_PROFILE_TYPE_STORAGE } from 'app/constants';
import { updateRenterProfile } from 'reducers/renter-profile';
import { rentalOptionsInitialValues } from 'utils/misc';
import GenericFormMessage from 'components/common/GenericFormMessage';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 123px;
        max-width: 123px;
    }
`;

export const Storage = props => {
    const [errorSubmitting, setErrorSubmitting] = useState(false);
    if (!props.config || !props.application) return null;

    const onSubmit = (values, { setSubmitting, setErrors }) => {
        setErrorSubmitting(false);
        const selectedRentalOptionsArray = [];
        Object.entries(values).forEach(option => {
            selectedRentalOptionsArray.push({ rental_option: {id: parseInt(option[0])}, quantity: option[1]});
        });
        const selectedRentalOptions = Object.assign({}, {selected_rental_options: selectedRentalOptionsArray});
        return props.updateRenterProfile(selectedRentalOptions).then((res) => {
            if (res.errors) {
                setErrors(res.errors);
                setErrorSubmitting(true);
            } else {
                props.history.push(`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_STORAGE}`);
            }
            setSubmitting(false);
        });
    };

    const initialStorageOptions = props.application.selected_rental_options.storage;

    const storageOptions = props.config.rental_options.storage || [];
    return <>
        <H1>Storage</H1>
        <SpacedH3>We help you make room for what matters most.</SpacedH3>
        <ImageContainer>
            <img src={storageImage} alt="storage"/>
        </ImageContainer>
        <Formik
            onSubmit={onSubmit}
            initialValues={rentalOptionsInitialValues(initialStorageOptions)}
        >
            {({
                values,
                handleSubmit,
                setFieldValue,
            }) => (
                <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                    {errorSubmitting &&
                        <GenericFormMessage
                            type="error" messages={['We couldn’t save your storage options. Please try again.']}
                        />
                    }
                    { storageOptions.map(option =>
                        <ItemAdder
                            key={option.id}
                            title={option.name}
                            subtitle={`$${option.monthly_amount}/mo per storage space`}
                            value={values[option.id]}
                            limit={option.limit}
                            onChange={e => setFieldValue(option.id, e)}
                        />
                    )}
                    <Box padding="30px 0">
                        <Tip
                            text={
                                <P>2 storage spaces cost <b>$10/mo</b><br/> bringing your total rent to <b>$3,475/mo.</b></P>
                            }
                        />
                    </Box>
                    <ActionButton>Add Storage</ActionButton>
                </form>
            )}
        </Formik>
        <Box padding="20px">
            <BackLink to={`${ROUTES.PROFILE_OPTIONS}#${RENTER_PROFILE_TYPE_STORAGE}`}/>
        </Box>
    </>;
};

const mapStateToProps = state => ({
    config: state.configuration,
    application: state.renterProfile,
});

export default connect(mapStateToProps, { updateRenterProfile })(Storage);
