import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, P } from 'assets/styles';

export const Subtitle = styled.small`
    color: #818797;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
`

const Header = styled.div`
    border-bottom: 1px solid #EEEEEE;
    padding: 20px;
`

const Decision = styled.div`
    margin-top: 13px;
    white-space: pre-line;
    text-align: left;
    overflow-wrap: normal;
`;

export default function DenialReason (props) {
    return (
        <div>
            <Header>
                <H1>Reason for Our Decision</H1>
                <br/>
                <Subtitle>Adverse action notice</Subtitle>
            </Header>
            <Decision>
                <P color="#818797">
                    {props.date}
                </P>
                <br/>
                <P>Dear {props.name},</P>
                <br/>
                <P>
                    Thank you for your recent rental application for {props.buildingName}{props.buildingName &&
                    props.unitNumber && <>,</>}{props.unitNumber}.
                </P>
                <br/>
                <P>
                    Unfortunately, we are unable to approve your rental application.
                </P>
                <br/>
                <P>
                    In evaluating your application, <b>TransUnion Consumer Solutions</b> provided us with information that in
                    whole or in part influenced our decision. <b>The reporting agency played no part in our decision other
                    than providing us with information about you.</b>
                </P>
                <br/>
                <P>
                    Under the Fair Credit Reporting Act, you have the right to know the information provided to us, which
                    can be obtained by contacting:
                </P>
                <br/>
                <P>
                    <b>TransUnion Consumer Solutions</b><br/>
                    P.O. Box 2000<br/>
                    Chester, PA. 19022-2000<br/>
                    <a href="tel:1-800-916-8800">1-800-916-8800</a>
                </P>
                <br/>
                <P>
                    Background Data Solutions<br/>
                    <a href="tel:1-800-568-5665">1-800-568-5665</a><br/>
                </P>
                <br/>
                <P>
                    You have the right to a free copy of your report from the reporting agency, if you request it no later
                    than 60 days after you receive this notice. In addition, if you find that any information contained in
                    the report you receive is inaccurate or incomplete, you have the right to dispute the matter with the
                    reporting agency that provided the report or through <b>TransUnion Rental Screening Solutions</b> consumer
                    relations at <a href="tel:1-800-230-9376">1-800-230-9376</a> or <a href="mailto:consumer_relations@turss.com">consumer_relations@turss.com</a>.
                </P>
                <br/>
            </Decision>
            <ActionButton marginTop={39} onClick={props.onAgree}>OK</ActionButton>
        </div>
    )
}

DenialReason.propTypes = {
    date: PropTypes.string,
    buildingName: PropTypes.string,
    unitNumber:PropTypes.string,
    name:PropTypes.string,
    onAgree: PropTypes.func.isRequired
};