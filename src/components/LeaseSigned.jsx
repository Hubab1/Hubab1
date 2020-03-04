import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';

import API from 'app/api';
import contract from 'assets/images/contract.svg';
import { H1, SpacedH3, P } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export const ApprovedImage = styled.img`
    padding-top: 10px;
    height: 200px;
`;

export const gridContainer = css`
    padding-top: 35px;
    min-height: 100px;
`;

export function LeaseSigned(props) {
    const [url, setUrl] = useState('');
    useEffect(() => {
        (async ()=>{
            const response = await API.leaseDocumentUrl();
            setUrl(response.url);
        })();
    }, [])
    const unit = props.unit;
    const community = props.community;
    if (!unit || !community) return null;

    return (
        <>
            <H1>Thanks for Signing!</H1>
            <SpacedH3>We'll let you know when everyone has signed the lease.</SpacedH3>
            <ApprovedImage src={contract}/>
            <div>
                <P fontSize={14}>{community.display_name} Unit {unit.unit_number}</P>
            </div>
            <div className={gridContainer}>
                <ActionButton href={url} marginTop={30}>
                    View Lease
                </ActionButton>
            </div>
        </>
    )
}

LeaseSigned.propTypes = {
    unit: PropTypes.object,
    community: PropTypes.object,
}

const mapStateToProps = state => ({
    unit: state.renterProfile && state.renterProfile.unit,
    community: state.configuration && state.configuration.community,
});


export default connect(mapStateToProps)(LeaseSigned);
