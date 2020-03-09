import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';

import ActionButton from 'components/common/ActionButton/ActionButton';
import YourIncome from './YourIncome';
import YourAccountBalance from './YourAccountBalance';
import { H1, SpacedH3, PrimarySpan, cursor } from 'assets/styles';
import API, { MOCKY } from 'app/api';


export class ReviewAccountsPage extends React.Component {

    confirmAccounts = (values, { setSubmitting }) => {
        const incomeNamePromises = [];
        if (!MOCKY) {
            const initalValues = this.props.incomeNameInitialValues;
            const incomeNamePromises = [];
            Object.entries(values).forEach( entry => {
                const finicityId = entry[0];
                const employerName = entry[1]

                if (initalValues[finicityId] !== employerName){
                    const data = {
                        finicity_income_stream_id: finicityId,
                        name: employerName
                    };
                    incomeNamePromises.push(API.createIncomeStream(data));
                }
            });
        }
        // TODO: error handling
        Promise.all(incomeNamePromises).then( data => {
            this.props.pushNextPage()
        })
    }

    resetIncomeVerification = () => {
        this.props.resetReportData();
    }

    render () {
        return (
            <Fragment>
                <H1>Compare Income & Assets</H1>
                <SpacedH3>Just arrived: your bank account information. Please review below.</SpacedH3>
                <Formik
                    initialValues={this.props.incomeNameInitialValues}
                    onSubmit={this.confirmAccounts}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <YourIncome
                                incomeEntries={this.props.incomeEntries}
                                incomeTotal={this.props.incomeTotal}
                                values={values}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                            />
                            <YourAccountBalance assetsBalance={this.props.assetsTotal}/>
                            <ActionButton marginTop={30} marginBottom={20} disabled={isSubmitting}>
                                Looks Good
                            </ActionButton>
                        </form>
                    )}
                </Formik>
                <PrimarySpan
                    className={cursor}
                    role="button"
                    onClick={this.resetIncomeVerification}
                >
                    Start Income Verification Over Again
                </PrimarySpan>
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
