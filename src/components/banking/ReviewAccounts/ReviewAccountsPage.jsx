import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import ActionButton from 'components/common/ActionButton/ActionButton';
import YourIncome from './YourIncome';
import YourAccountBalance from './YourAccountBalance';
import { BackLink } from 'components/common/BackLink';
import { H1, SpacedH3 } from 'assets/styles';
import { ROUTES } from 'app/constants';



export class ReviewAccountsPage extends React.Component {

    confirmAccounts = () => {
        this.props.history.push({
            pathname: ROUTES.APPLICATION_FEE, 
        });
    }

    render () {
        return (
            <Fragment>
                <H1>Compare Income & Assets</H1>
                <SpacedH3>Just arrived: your bank account information. Please review below.</SpacedH3>
                <YourIncome
                    incomeEntries={this.props.incomeEntries}
                    incomeTotal={this.props.incomeTotal}
                />
                <YourAccountBalance assetsBalance={this.props.assetsTotal}/>
                <ActionButton onClick={this.confirmAccounts} marginTop={30} marginBottom={20}>
                    Looks Good
                </ActionButton>
                <BackLink to={ROUTES.CONNECT_BANK}/>
            </Fragment>
        );
    }
}

ReviewAccountsPage.propTypes = {
    incomeEntries: PropTypes.array,
    incomeTotal: PropTypes.number,
    assetsTotal: PropTypes.number,
}

export default ReviewAccountsPage;