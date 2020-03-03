import React from 'react';
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
    const unit = props.unit;
    const community = props.community;
    if (!unit || !community) return null;
    async function viewLease() {
        const response = await API.leaseDocumentUrl();
        if (response.url) {
            window.open(response.url);
        }
    }
    return (
        <>
            <H1>Thanks for signing!</H1>
            <SpacedH3>We'll let you know when everyone has signed the lease.</SpacedH3>
            <ApprovedImage src={contract}/>
            <div>
            <P fontSize={14}>{community.display_name} Unit {unit.unit_number}</P>
            </div>
            <div className={gridContainer}>
                <ActionButton onClick={viewLease} marginTop={30}>
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
