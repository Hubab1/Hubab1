import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { css } from 'emotion';

import { H1, H3 } from 'assets/styles';
import { pageComplete } from 'reducers/renter-profile';
import catOnCouch from 'assets/images/cat-on-couch.png';
import { UNIT_NOT_HELD_WAITING_IDENTIFIER } from 'app/constants';

const SpacedH1 = styled(H1)`
    margin-top: 35px;
    margin-bottom: 10px;
`;

const bodyRowImg = css`
    margin-top: 40px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 40%;
    height: auto;
`;

const bodyRowAddress = css`
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

export const UnitNotHeldWaitingPage = ({
    primaryApplicantFirstName,
    primaryApplicantLastName,
    communityName,
    unitNumber,
    pageComplete,
}) => {
    useEffect(() => {
        pageComplete(UNIT_NOT_HELD_WAITING_IDENTIFIER);
    });

    return (
        <Fragment>
            <SpacedH1>
                Waiting on {primaryApplicantFirstName} {primaryApplicantLastName}
            </SpacedH1>
            <H3>
                You'll be able to continue once {primaryApplicantFirstName} submits their application, putting your unit
                on hold. We'll let you know when you're all set to continue.
            </H3>
            <img className={bodyRowImg} src={catOnCouch} alt="cat on couch" />
            <span className={bodyRowAddress}>{`${communityName} Unit ${unitNumber}`}</span>
        </Fragment>
    );
};

UnitNotHeldWaitingPage.propTypes = {
    primaryApplicantFirstName: PropTypes.string.isRequired,
    primaryApplicantLastName: PropTypes.string.isRequired,
    communityName: PropTypes.string.isRequired,
    unitNumber: PropTypes.string.isRequired,
};

export default connect(null, { pageComplete })(UnitNotHeldWaitingPage);
