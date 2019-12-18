import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { Formik } from 'formik';
import Box from '@material-ui/core/Box';

import Tip from 'components/common/Tip';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { BackLink } from 'components/common/BackLink';
import withRelativeRoutes from 'app/withRelativeRoutes';
import ItemAdder from 'components/common/ItemAdder';
import parkingImage from 'assets/images/parking.png';
import { H1, SpacedH3, P } from 'assets/styles';
import { ROUTES } from 'app/constants';

const ImageContainer = styled.div`
    margin-top: 31px;
    margin-bottom: 31px;
    img {
        max-height: 123px;
        max-width: 123px;
    }
`

export const Parking = props => {
    if (!props.config) return null;

    const onSubmit = (values) => {
        props._nextRoute();
    };
    const parkingOptions = props.config.options.parking;
    return <>
        <H1>Parking</H1>
        <SpacedH3>This is a request for parking. All parking is based on availability.</SpacedH3>
        <ImageContainer>
            <img src={parkingImage} alt="car parking"/>
        </ImageContainer>
        <Formik
            onSubmit={onSubmit}
        >
            {({
                values,
                handleSubmit,
                setFieldValue,
                errors
            }) => (
                <form className="text-left" onSubmit={handleSubmit} autoComplete="off">
                    { parkingOptions.map(option => 
                        <ItemAdder
                            key={option.id}
                            title={option.name}
                            subtitle={`$${option.monthly_amount}/mo per parking space`}
                            value={values[option.id]}
                            limit={option.limit}
                            onChange={e => setFieldValue(option.id, e)}
                        />
                    )}
                    <Box padding="30px 0">
                        <Tip
                            text={
                                <P>3 parking spaces cost <b>$55/mo</b><br/> bringing your total rent to <b>$3,535/mo.</b></P>
                            }
                        />
                    </Box>
                    <ActionButton>Add Parking</ActionButton>
                </form>
            )}
        </Formik>
        <Box padding="20px">
            <BackLink to={props._prev}/>
        </Box>
    </>
};

const mapStateToProps = state => ({
    config: state.configuration,
});

export default connect(mapStateToProps, null)(withRelativeRoutes(Parking, ROUTES.PARKING));