import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import ConnectBankPage from './ConnectBankPage';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';
import AddIncomeSource from './AddIncomeSource';

class BankingContainer extends Component {
    render() {
        return (
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_VERIFICATION} component={ManualIncomeVerificationPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSource}/>
            </Switch>
        );
    }
};

export default BankingContainer;
