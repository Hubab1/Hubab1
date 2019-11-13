import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1 } from 'assets/styles';

export const Subtitle = styled.small`
    color: #818797;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
`

const Header = styled.div`
    border-bottom: 1px solid #EEEEEE;
    padding: 20px;
`

const Policy = styled.div`
    margin-top: 30px;
    white-space: pre-line;
    text-align: left;
    overflow-wrap: normal;
`

const Contact = styled.div`
    margin-bottom: 36px;
    text-align: left;
    font-weight: 600;
`

export default function PetBreedPolicy (props) {
    return (
        <div>
            <Header>
                <H1>Pet Restrictions</H1>
            </Header>
            <Policy>
                {props.breedPolicy}
            </Policy>
            <br/>
            <Contact>
                {`Please call us at ${props.contactPhone} if your pet is subject to one of the restrictions listed above.`}
            </Contact>
            <ActionButton onClick={props.onAgree}>Got It</ActionButton>
        </div>
    )
}

PetBreedPolicy.propTypes = {
    breedPolicy: PropTypes.string,
    onAgree: PropTypes.func.isRequired,
    contactPhone: PropTypes.string,
}