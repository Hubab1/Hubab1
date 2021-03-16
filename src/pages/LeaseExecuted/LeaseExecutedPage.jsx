import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';

import { ROUTES, DOCUMENT_TYPE_LEASE } from 'constants/constants';
import API from 'api/api';
import captureRoute from 'utils/captureRoute';

import ActionButton from 'common-components/ActionButton/ActionButton';
import { H1, SpacedH3, P } from 'assets/styles';
import house from 'assets/images/house.svg';

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const buttonsContainer = css`
    padding-top: 35px;
    min-height: 100px;
`;

export function LeaseExecutedPage(props) {
    const [url, setUrl] = useState('');
    useEffect(() => {
        (async () => {
            const response = await API.leaseDocumentUrl(props.profile.id, DOCUMENT_TYPE_LEASE);
            setUrl(response.url);
        })();
    }, []);
    const unit = props.unit;
    const community = props.community;
    if (!unit || !community) return null;

    return (
        <>
            <H1>Welcome To Your New Home!</H1>
            <SpacedH3>{`Your application has been completed and we can't wait for you to move in.`}</SpacedH3>
            <Img src={house} />
            <div>
                <P fontSize={14}>
                    {community.display_name} Unit {unit.unit_number}
                </P>
            </div>
            <div className={buttonsContainer}>
                <ActionButton href={url} marginTop={17} variant="outlined">
                    View Lease
                </ActionButton>
            </div>
        </>
    );
}

LeaseExecutedPage.propTypes = {
    unit: PropTypes.object,
    community: PropTypes.object,
};

const mapStateToProps = (state) => ({
    unit: state.renterProfile && state.renterProfile.unit,
    profile: state.renterProfile,
    community: state.configuration && state.configuration.community,
});

export default connect(mapStateToProps)(captureRoute(LeaseExecutedPage, ROUTES.LEASE_EXECUTED));
