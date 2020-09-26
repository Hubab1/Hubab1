import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { H1, P, Bold, Spacer } from 'assets/styles';
import API from 'app/api';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';

const Header = styled(H1)`
    margin: 20px 0;
`;

const Divider = styled.hr`
    border-style: none;
    border-bottom: 2px solid #eeeeee;
    margin-top: 20px;
    margin-bottom: 22px;
    margin-left: -20px;
    margin-right: -20px;
`;

export class ResetApplicantFinancials extends React.Component {
    state = { errorSubmitting: false, financialSource: null, submitting: false };

    onSubmit = async () => {
        this.setState({ submitting: true });
        try {
            await API.resetApplicantFinancials();
        } catch {
            this.setState({ submitting: false, errorSubmitting: true });
            return;
        }
        this.setState({ submitting: false });
        this.props.onSubmit();
    };

    render() {
        return (
            <>
                <Header>Start Income Verification Over</Header>
                <Divider />
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={[
                            'Oops! We had some trouble removing your financial records. Try again in a little bit.',
                        ]}
                    />
                )}
                <div className="text-left">
                    <Bold fontSize={18}>Are you sure you want to start over?</Bold>
                    <br />
                    <br />
                    <Spacer height={20} />
                    <P>
                        Starting over means that you will lose any income sources or assets that have already been
                        added.
                    </P>
                </div>
                <ActionButton
                    disabled={this.state.submitting}
                    onClick={this.onSubmit}
                    marginBottom={20}
                    marginTop={150}
                >
                    Start Over
                </ActionButton>
                <ActionButton onClick={this.props.onCancel} variant="outlined" marginBottom={20}>
                    Cancel
                </ActionButton>
            </>
        );
    }
}

ResetApplicantFinancials.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};

export default ResetApplicantFinancials;
