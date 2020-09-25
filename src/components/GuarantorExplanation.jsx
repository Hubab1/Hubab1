import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1 } from 'assets/styles';
import { prettyFormatPhoneNumber } from 'utils/misc';

export const Subtitle = styled.small`
    color: #818797;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
`;

const Header = styled.div`
    border-bottom: 1px solid #EEEEEE;
    padding: 20px;
`;

const Policy = styled.div`
    margin-top: 30px;
    white-space: pre-line;
    text-align: left;
    overflow-wrap: normal;
    font-size: 16px;
`;

const Contact = styled.div`
    margin-top: 21px;
    text-align: left;
    font-weight: 600;
    font-size: 16px;
`;

export default function GuarantorExplanation (props) {
    return (
        <div>
            <Header>
                <H1>Guarantors</H1>
            </Header>
            <Policy>
                {`A guarantor is someone who agrees to be legally responsible for the rent if you are unable to pay. Guarantors are required to make ${props.multiplier}x the monthly rent.`}</Policy>
            <br/>
            <Contact>
                Please call us at&nbsp;
                <a href={`tel:${props.contactPhone}`}>
                    {prettyFormatPhoneNumber(props.contactPhone)}
                </a> if you have any questions or if you are unable or unwilling to add a guarantor.
            </Contact>
            <ActionButton onClick={props.onAgree} marginTop={189}>Got It</ActionButton>
        </div>
    );
}

GuarantorExplanation.propTypes = {
    onAgree: PropTypes.func.isRequired,
    contactPhone: PropTypes.string,
    multiplier: PropTypes.number.isRequired,
};
