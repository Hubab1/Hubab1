import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { clearFinancialSources, refreshFinancialSources } from 'reducers/banking';
import { ROUTES } from 'constants/constants';
import withRelativeRoutes from 'utils/withRelativeRoutes';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { actions as loaderActions } from 'reducers/loader';

import BankingContext from './BankingContext';
import ConnectBankPage from './pages/ConnectBankPage';
import IncomeVerificationSummaryPage from './pages/IncomeVerificationSummaryPage';
import EmployerDetailsPage from './pages/EmployerDetailsPage';
import AddAssetSourcePage from './pages/AddAssetSourcePage';
import AddIncomeSourcePage from './pages/AddIncomeSourcePage';
import EditFinancialSourcePage from './pages/EditFinancialSourcePage';
import RemoveFinancialSourcePage from './pages/RemoveFinancialSourcePage';

function BankingContainer({
    history,
    _nextRoute,
    fetchRenterProfile,
    refreshFinancialSources,
    clearFinancialSources,
    toggleLoader,
    bankingData,
}) {
    return (
        <BankingContext.Provider
            value={{
                refreshFinancialSources,
                bankingData,
                fetchRenterProfile,
                clearFinancialSources,
                _nextRoute,
                history,
                toggleLoader,
            }}
        >
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact />
                <Route path={ROUTES.INCOME_VERIFICATION_SUMMARY} component={IncomeVerificationSummaryPage} />
                <Route path={ROUTES.EMPLOYER_DETAILS} component={EmployerDetailsPage} />
                <Route path={ROUTES.MANUAL_INCOME_ENTRY_ADD_INCOME} component={AddIncomeSourcePage} />
                <Route path={ROUTES.MANUAL_ASSET_ENTRY_ADD_ASSET} component={AddAssetSourcePage} />
                <Route path={ROUTES.EDIT_MANUAL_FINANCIAL_SOURCE} component={EditFinancialSourcePage} />
                <Route path={ROUTES.REMOVE_FINANCIAL_SOURCE} component={RemoveFinancialSourcePage} />
            </Switch>
        </BankingContext.Provider>
    );
}

BankingContainer.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    applicant: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
    toggleLoader: PropTypes.func,
    _nextRoute: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicant: state.applicant,
    configuration: state.configuration,
    bankingData: state.banking,
});

const mapDispatchToProps = {
    fetchRenterProfile,
    refreshFinancialSources,
    clearFinancialSources,
    toggleLoader: loaderActions.toggleLoader,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRelativeRoutes(BankingContainer, ROUTES.BANKING));
