import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import ActionButton from 'components/common/ActionButton/ActionButton';
import YourIncome from './YourIncome';
import YourAccountBalance from './YourAccountBalance';
import { BackLink } from 'components/common/BackLink';
import { H1, SpacedH3 } from 'assets/styles';
import { ROUTES, exampleFinicityJson } from 'app/constants';



export class ReviewAccountsPage extends React.Component {

    confirmAccounts = () => {
        console.log('do some stuff');
    }

    render () {
        return (
            <Fragment>
                <H1>Compare Income & Assets</H1>
                <SpacedH3>Just arrived: you bank account information. Please review below.</SpacedH3>
                <YourIncome incomeData={exampleFinicityJson.voi}/>
                <YourAccountBalance assetsData={exampleFinicityJson.voa}/>
                <ActionButton onClick={this.confirmAccounts} marginTop="30px" marginBottom="20px">
                    Looks Good
                </ActionButton>
                <BackLink to={ROUTES.CONNECT_BANK}/>
            </Fragment>
        );
    }
}

ReviewAccountsPage.propTypes = {
    reportData: PropTypes.object,
}

export default ReviewAccountsPage;