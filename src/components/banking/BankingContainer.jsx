import React, { useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ROUTES, MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED } from 'app/constants';
import API from 'app/api';
import reducer from './reducer';
import withRelativeRoutes from 'app/withRelativeRoutes';
import EditFinancialSource from './EditFinancialSource';
import RemoveFinancialSource from './RemoveFinancialSource';
import ConnectBankPage from './ConnectBankPage';
import IncomeVerificationSummaryPage from './IncomeVerificationSummaryPage';
import AddIncomeSource from './AddIncomeSource';
import AddAssetSource from './AddAssetSource';
import BankingContext from './BankingContext';

function BankingContainer({ applicationEvents, history, _nextRoute }) {
    const [state, dispatch] = useReducer(reducer, {});

    const refreshFinancialSources = useCallback(async () => {
        const response = await API.getFinancialSources();
        if (response.status === 200) {
            const data = await response.json();
            dispatch({ type: 'BANKING_DATA_RECEIVED', data });
            return data;
        }
    }, []);

    useEffect(() => {
        (async () => {
            const data = await refreshFinancialSources();
            const agentRequestedIncomeAssets = applicationEvents.find(
                ({ event }) => event === MILESTONE_FINANCIAL_STREAM_MISSING_DOCUMENTS_REQUESTED
            );

            if (agentRequestedIncomeAssets) return;
            if (data?.income_sources?.length || data?.asset_sources?.length || data?.reported_no_income_assets) {
                history.push(ROUTES.INCOME_VERIFICATION_SUMMARY);
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <BankingContext.Provider
            value={{
                refreshFinancialSources,
                bankingData: state.bankingData,
                clearFinancialSources: () => dispatch({ type: 'BANKING_DATA_CLEARED' }),
                _nextRoute,
            }}
        >
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact />
                <Route path={ROUTES.INCOME_VERIFICATION_SUMMARY} component={IncomeVerificationSummaryPage} />
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSource} />
                <Route path={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET} component={AddAssetSource} />
                <Route path={ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE} component={EditFinancialSource} />
                <Route path={ROUTES.REMOVE_FINANCIAL_SOURCE} component={RemoveFinancialSource} />
            </Switch>
        </BankingContext.Provider>
    );
}

BankingContainer.propTypes = {
    applicationEvents: PropTypes.array,
    history: PropTypes.object,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicationEvents: state.renterProfile?.events,
});

const mapDispatchToProps = null;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRelativeRoutes(BankingContainer, ROUTES.INCOME_AND_EMPLOYMENT));
