import React, { useReducer, useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from 'app/constants';
import withRelativeRoutes from 'app/withRelativeRoutes';
import EditFinancialSource from 'components/banking/EditFinancialSource';
import RemoveFinancialSource from 'components/banking/RemoveFinancialSource';
import ConnectBankPage from 'components/banking/ConnectBankPage';
import IncomeVerificationSummaryPage from 'components/banking/IncomeVerificationSummaryPage';
import AddIncomeSource from 'components/banking/AddIncomeSource';
import AddAssetSource from 'components/banking/AddAssetSource';
import BankingContext from 'components/banking/BankingContext';
import EmployerDetails from 'components/banking/employer-details/EmployerDetails';
import { fetchRenterProfile } from 'reducers/renter-profile';
import { clearFinancialSources, refreshFinancialSources } from 'reducers/banking';

function BankingContainer({ history, _nextRoute, fetchRenterProfile, refreshFinancialSources, bankingData }) {
    return (
        <BankingContext.Provider
            value={{
                refreshFinancialSources,
                bankingData,
                fetchRenterProfile,
                clearFinancialSources,
                _nextRoute,
                history,
            }}
        >
            <Switch>
                <Route path={ROUTES.INCOME_AND_EMPLOYMENT} component={ConnectBankPage} exact />
                <Route path={ROUTES.INCOME_VERIFICATION_SUMMARY} component={IncomeVerificationSummaryPage} />
                <Route path={ROUTES.EMPLOYER_DETAILS} component={EmployerDetails} />
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
    applicant: PropTypes.object,
    configuration: PropTypes.object,
    fetchRenterProfile: PropTypes.func,
};

const mapStateToProps = (state) => ({
    applicationEvents: state.renterProfile?.events,
    applicant: state.applicant,
    configuration: state.configuration,
    bankingData: state.banking,
});

const mapDispatchToProps = { fetchRenterProfile, refreshFinancialSources, clearFinancialSources };

export default connect(mapStateToProps, mapDispatchToProps)(withRelativeRoutes(BankingContainer, ROUTES.BANKING));
