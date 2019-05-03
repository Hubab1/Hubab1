import React, { Fragment } from 'react';
import { generatePath } from 'react-router';

import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, P, TextReader, Bold } from 'assets/styles';
import { ROUTES } from 'constants.js';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;

export class TermsPage extends React.Component {

    handleClickNext = () => {
        const { history, match } = this.props;
        const communityId = match.params.communityId;
        history.push(generatePath(ROUTES.PROFILE_OPTIONS, {communityId}));
    }

    handleClickBack = () => {
        const { history, match } = this.props;
        const communityId = match.params.communityId;
        // maybe clear session here too? Or maybe it doesn't make sense to go back from this page?
        history.push(generatePath(ROUTES.SIGNUP, {communityId}));
    }

    render () {
        return (
            <Fragment>
                <H1>Terms and Conditions</H1>
                <br/>
                <TextReader>
                    <div>Terms and Conditions</div>
                    <div>General Site Usage</div>
                    <div>Last Revised: December 16, 2013</div>
                    <br/>
                    <div>Welcome to 555 Waverly. {LOREM}</div>
                    <br/>
                    <Bold>1. YOUR AGREEMENT</Bold>
                    <br/>
                    <div>By using this site, {LOREM}</div>
                    <br/>
                    <Bold>PLEASE NOTE: </Bold><span>We reserve the right {LOREM}</span>
                    <br/>
                    <br/>
                    <Bold>2. PRIVACY</Bold>
                    <br/>
                    <div>Please {LOREM}</div>
                </TextReader>
                <br/>
                <ActionButton onClick={this.handleClickNext} marginTop="20px" marginBottom="10px">
                    I Agree to the Terms & Conditions
                </ActionButton>
                <P onClick={this.handleClickBack}>Go Back</P>
            </Fragment>
        );
    }
}

export default TermsPage;
