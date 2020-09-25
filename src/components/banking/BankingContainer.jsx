import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ROUTES } from 'app/constants';
import ConnectBankPage from './ConnectBankPage';
import IncomeVerificationSummaryPage from './IncomeVerificationSummaryPage';
import AddIncomeSource from './AddIncomeSource';
import AddAssetSource from './AddAssetSource';
import BankingContext from './BankingContext';
import API from 'app/api';
import reducer from './reducer';
import EditFinancialSource from './EditFinancialSource';
import RemoveFinancialSource from './RemoveFinancialSource';
import withRelativeRoutes from 'app/withRelativeRoutes';

function BankingContainer (props) {
    const [state, dispatch] = React.useReducer(reducer, {});
    async function refreshFinancialSources () {
        const response = await API.getFinancialSources();
        if (response.status === 200) {
            const data = await response.json();
            dispatch({type: 'BANKING_DATA_RECEIVED', data});
            return data;
        }
    };
    React.useEffect(() => {
        (async () => {
            const data = await refreshFinancialSources();
            if (data?.income_sources?.length || data?.asset_sources?.length) {
                props.history.push(ROUTES.INCOME_VERIFICATION_SUMMARY);
            }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <BankingContext.Provider value={{
            refreshFinancialSources,
            bankingData: state.bankingData,
            clearFinancialSources: ()=> dispatch({type: 'BANKING_DATA_CLEARED'}),
            _nextRoute: props._nextRoute,
        }}>
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact/>
                <Route path={ROUTES.INCOME_VERIFICATION_SUMMARY} component={IncomeVerificationSummaryPage}/>
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSource}/>
                <Route path={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET} component={AddAssetSource}/>
                <Route path={ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE} component={EditFinancialSource}/>
                <Route path={ROUTES.REMOVE_FINANCIAL_SOURCE} component={RemoveFinancialSource}/>
            </Switch>
        </BankingContext.Provider>
    );
};

export default withRelativeRoutes(BankingContainer, ROUTES.INCOME_AND_EMPLOYMENT);
