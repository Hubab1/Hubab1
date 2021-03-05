import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { ROUTES, FINANCIAL_STREAM_ASSET, ALL_INCOME_OR_ASSET_TYPES } from 'constants/constants';
import API from 'api/api';
import { prettyCurrency } from 'utils/misc';
import { logToSentry } from 'utils/sentry';

import GenericFormMessage from 'components//GenericFormMessage/GenericFormMessage';
import ActionButton from 'components//ActionButton/ActionButton';
import BankingContext from 'pages/Banking/BankingContext';
import { H1, H3, P, Bold } from 'assets/styles';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 22px;
`;

const Divider = styled.hr`
    border-style: none;
    border-bottom: 2px solid #eeeeee;
    margin-bottom: 22px;
`;

export class RemoveFinancialSourcePage extends React.Component {
    state = { errorSubmitting: false, financialSource: null, submitting: false };

    onSubmit = async () => {
        /* eslint-disable no-unused-expressions */
        this.context.toggleLoader?.(true);
        this.setState({ submitting: true });
        try {
            await API.deleteFinancialSource(this.props.match.params.id);
            this.context.refreshFinancialSources?.();
            this.props.history.push(this.returnLink);
        } catch (e) {
            this.setState({ errorSubmitting: true });
            logToSentry(e.response || e);
        } finally {
            this.context.toggleLoader?.(false);
            this.setState({ submitting: false });
        }
    };
    async componentDidMount() {
        this.fetchFinancialSource();
    }
    async fetchFinancialSource() {
        try {
            const data = await API.getFinancialSource(this.props.match.params.id);
            this.setState({ financialSource: data });
        } catch (e) {
            logToSentry(e.response || e);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.fetchFinancialSource();
        }
    }

    get isAsset() {
        return this.state.financialSource?.stream_type === FINANCIAL_STREAM_ASSET;
    }

    get returnLink() {
        return `${ROUTES.INCOME_VERIFICATION_SUMMARY}#${this.isAsset ? 'asset' : 'income'}`;
    }

    render() {
        const financialSource = this.state.financialSource;
        if (!financialSource) return null;
        const isAsset = financialSource.stream_type === FINANCIAL_STREAM_ASSET;
        return (
            <>
                <SkinnyH1>Remove {isAsset ? 'Asset' : 'Income Source'}?</SkinnyH1>
                <SpacedH3>
                    {ALL_INCOME_OR_ASSET_TYPES[financialSource.income_or_asset_type]?.label} -{' '}
                    {prettyCurrency(financialSource.estimated_amount)}
                    {isAsset ? '' : '/year'}
                </SpacedH3>
                <Divider />
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={[
                            'Oops! We had some trouble removing your financial source. Try again in a little bit.',
                        ]}
                    />
                )}
                <div className="text-left">
                    <Bold fontSize={18}>
                        Are you sure you want to remove this {isAsset ? 'asset' : 'income source'}?
                    </Bold>
                    <br />
                    <br />
                    {!isAsset && (
                        <P>
                            Removing this income source means that all uploaded files associated with it will be deleted
                            and it will no longer count towards your total annual income.
                        </P>
                    )}
                    {isAsset && (
                        <P>
                            Removing this asset means that all uploaded files associated with it will be deleted and it
                            will no longer count towards your total asset balance.
                        </P>
                    )}
                </div>
                <ActionButton
                    disabled={this.state.submitting}
                    onClick={this.onSubmit}
                    marginBottom={20}
                    marginTop={100}
                >
                    Remove {isAsset ? 'Asset' : 'Income Source'}
                </ActionButton>
                <ActionButton
                    onClick={() => this.props.history.push(this.returnLink)}
                    variant="outlined"
                    marginBottom={20}
                >
                    Cancel
                </ActionButton>
            </>
        );
    }
}

RemoveFinancialSourcePage.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
};

RemoveFinancialSourcePage.contextType = BankingContext;

export default RemoveFinancialSourcePage;
