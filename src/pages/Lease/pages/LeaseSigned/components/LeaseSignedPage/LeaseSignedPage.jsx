import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';

import { ROUTES, DOCUMENT_TYPE_LEASE } from 'constants/constants';
import API from 'api/api';
import captureRoute from 'utils/captureRoute';

import ActionButton from 'components//ActionButton/ActionButton';
import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';
import { H1, SpacedH3, P } from 'assets/styles';
import contract from 'assets/images/contract.svg';

export const Img = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const buttonsContainer = css`
    padding-top: 35px;
    min-height: 100px;
`;

export function LeaseSignedPage(props) {
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retried, setRetried] = useState(false);

    const fetchLeaseDocumentUrl = async ()=>{
        setLoading(true);
        const response = await API.leaseDocumentUrl(DOCUMENT_TYPE_LEASE);
        setUrl(response ? response.url : undefined);
        setError(response.url ? undefined : 'Lease document is still processing. Please try again later.');
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaseDocumentUrl();
    }, []);

    const unit = props.unit;
    const community = props.community;
    if (!unit || !community) return null;

    const onClick = () => {
        if (!url) {
            setRetried(true);
            fetchLeaseDocumentUrl();
        }
    };

    const getButtonText = () => {
        if (loading) {
            return 'Loading...';
        }
        if (url) {
            return 'View Lease';
        }
        return 'Retrieve Lease...';
    };

    return (
        <>
            <H1>Thanks for Signing!</H1>
            <SpacedH3>{`We'll let you know when everyone has signed the lease.`}</SpacedH3>
            <Img src={contract}/>
            <div>
                <P fontSize={14}>{community.display_name} Unit {unit.unit_number}</P>
            </div>
            <div className={buttonsContainer}>
                {retried && !!error && <GenericFormMessage type="error" messages={error}/>}
                <ActionButton
                    disabled={loading}
                    onClick={url ? undefined : onClick}
                    href={url}
                    marginTop={30}
                    variant="outlined"
                >
                    {getButtonText()}
                </ActionButton>
            </div>
        </>
    );
}

LeaseSignedPage.propTypes = {
    unit: PropTypes.object,
    community: PropTypes.object,
};

const mapStateToProps = state => ({
    unit: state.renterProfile && state.renterProfile.unit,
    community: state.configuration && state.configuration.community,
});


export default connect(mapStateToProps)(captureRoute(LeaseSignedPage, ROUTES.LEASE_SIGNED));
