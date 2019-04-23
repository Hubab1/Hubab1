import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';

import { H1, Link, TextReader, Bold } from 'assets/index';
import { nextRoute, previousRoute } from 'utils/routeNavigation';

const LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;

export class Terms extends React.Component {

    handleClickNext = () => {
        const { history } = this.props;
        const path = history.location.pathname;
        const nextPage = nextRoute(path)
        history.push(nextPage)
    }

    handleClickBack = () => {
        const { history } = this.props;
        const path = history.location.pathname;
        const previousPage = previousRoute(path)
        history.push(previousPage)
    }

    render () {
        return (
            <Fragment>
                <H1>Terms and Conditions</H1>
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
                <Button onClick={this.handleClickNext} variant="contained" color="primary" type="submit" fullWidth>
                    I Agree to the Terms & Conditions
                </Button>
                <br/>
                <br/>
                <Link onClick={this.handleClickBack}>Go Back</Link>
            </Fragment>
        );
    }
}

export default Terms;
