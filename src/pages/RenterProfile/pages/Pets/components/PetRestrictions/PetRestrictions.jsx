import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ActionButton from 'components//ActionButton/ActionButton';
import { H1 } from 'assets/styles';

const Header = styled.div`
    border-bottom: 1px solid #eeeeee;
    padding: 20px;
`;

const Policy = styled.div`
    margin-top: 30px;
    white-space: pre-line;
    text-align: left;
    overflow-wrap: normal;
`;

const Contact = styled.div`
    margin-bottom: 36px;
    text-align: left;
    font-weight: 600;
`;

export default function PetRestrictions(props) {
    return (
        <div>
            <Header>
                <H1>Pet Restrictions</H1>
            </Header>
            <Policy>{props.breedPolicy}</Policy>
            <br />
            <Contact>
                {`Please call us at ${props.contactPhone} if your pet is subject to one of the restrictions listed above.`}
            </Contact>
            <ActionButton onClick={props.onAgree}>Got It</ActionButton>
        </div>
    );
}

PetRestrictions.propTypes = {
    breedPolicy: PropTypes.string,
    onAgree: PropTypes.func.isRequired,
    contactPhone: PropTypes.string,
};
