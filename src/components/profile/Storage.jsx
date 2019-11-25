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
import storageImage from 'assets/images/storage.png';
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

export const Storage = props => {
    const onSubmit = (e) => {
        props._nextRoute();
    };
    return <>
        <H1>Storage</H1>
        <SpacedH3>We help you make room for what matters most.</SpacedH3>
        <ImageContainer>
            <img src={storageImage} alt="storage"/>
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
                    <ItemAdder
                        title="Small - 14sqft"
                        subtitle="$5/mo per storage space"
                        value={values.small_storage}
                        limit={3}
                        onChange={e => setFieldValue('small_storage', e)}
                    />
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
            <BackLink to={props._prev}/>
        </Box>
    </>
};


export default connect()(withRelativeRoutes(Storage, ROUTES.STORAGE));