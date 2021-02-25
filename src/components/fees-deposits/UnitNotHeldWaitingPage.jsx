import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { H1, H3 } from 'assets/styles';
import PropTypes from 'prop-types';
import catOnCouch from 'assets/images/cat-on-couch.png';

const SpacedH1 = styled(H1)`
    margin-top: 35px;
    margin-bottom: 10px;
`;

const bodyRowImg = css`
    margin-top: 40px;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

const bodyRowAddress = css`
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

export const UnitNotHeldWaitingPage = ({ primaryNameFirst, primaryNameLast, communityName, unitNumber }) => {
    return (
        <Fragment>
            <SpacedH1>
                Waiting on {primaryNameFirst} {primaryNameLast}
            </SpacedH1>
            <H3>
                You'll be able to continue once {primaryNameFirst} submits their application, putting your unit on hold.
                We'll let you know when we're all set to continue
            </H3>
            <img className={bodyRowImg} src={catOnCouch} alt="cat on couch" />
            <span className={bodyRowAddress}>{`${communityName} Unit ${unitNumber}`}</span>
        </Fragment>
    );
};

UnitNotHeldWaitingPage.propTypes = {
    primaryNameFirst: PropTypes.string,
    primaryNameLast: PropTypes.string,
    communityName: PropTypes.string,
    unitNumber: PropTypes.string,
};
