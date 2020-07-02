import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import ConnectBankPage from './ConnectBankPage';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';
import AddIncomeSource from './AddIncomeSource';
import AddAssetSource from './AddAssetSource';
import BankingContext from './BankingContext';
import API from 'app/api';
import reducer from './reducer';
import EditFinancialSource from './EditFinancialSource';
import RemoveFinancialSource from './RemoveFinancialSource';

function BankingContainer () {
    const [state, dispatch] = React.useReducer(reducer, {});
    async function refreshFinancialSources () {
        const response = await API.getFinancialSources();
        if (response.status === 200) {
            const data = await response.json();
            dispatch({type: 'BANKING_DATA_RECEIVED', data});
        }
    };
    React.useEffect(() => {
        refreshFinancialSources();
    }, []);

    return (
        <BankingContext.Provider value={{refreshFinancialSources, bankingData: state.bankingData}}>
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_VERIFICATION} component={ManualIncomeVerificationPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSource}/>
                <Route path={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET} component={AddAssetSource}/>
                <Route path={ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE} component={EditFinancialSource}/>
                <Route path={ROUTES.REMOVE_FINANCIAL_SOURCE} component={RemoveFinancialSource}/>
            </Switch>
        </BankingContext.Provider>
    );
};

export default BankingContainer;
