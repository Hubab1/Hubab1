import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import ConnectBankPage from './ConnectBankPage';
import ManualIncomeVerificationPage from './ManualIncomeVerificationPage';
import AddIncomeSource from './AddIncomeSource';
import AddAssetSource from './AddAssetSource';
import BankingContext from './BankingContext';
import API from 'app/api';

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case 'MANUAL_BANKING_DATA_RECEIVED':
        return Object.assign({}, state, {manualBankingData: action.data});
    default:
        return state;
  }
}

function BankingContainer () {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    React.useEffect(() => {
        (async () => {
            const response = await API.getFinancialSources();
            if (response.status === 200) {
                const data = await response.json();
                dispatch({type: 'MANUAL_BANKING_DATA_RECEIVED', data});
            }
        })();
    }, [])
    return (
        <BankingContext.Provider value={{dispatch, manualBankingData: state.manualBankingData}}>
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_VERIFICATION} component={ManualIncomeVerificationPage} exact/>
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSource}/>
                <Route path={ROUTES.MANUAL_ASSET_ENTRY_ADD_INCOME} component={AddAssetSource}/>
            </Switch>
        </BankingContext.Provider>
    );
};

export default BankingContainer;
