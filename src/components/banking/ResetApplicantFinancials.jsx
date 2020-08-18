import React from 'react';
import styled from '@emotion/styled';

import { H1, H3, P, Bold } from 'assets/styles';
import API from 'app/api';
import GenericFormMessage from 'components/common/GenericFormMessage';
import ActionButton from 'components/common/ActionButton/ActionButton';

const SkinnyH1 = styled(H1)`
    width: 70%;
`;

const SpacedH3 = styled(H3)`
    margin-top: 15px;
    margin-bottom: 22px;
`;

const Divider = styled.hr`
    border-style: none;
    border-bottom: 2px solid #EEEEEE;
    margin-bottom: 22px;
`;

export class ResetApplicantFinancials extends React.Component {
    state = { errorSubmitting: false, financialSource: null, submitting: false }
    
    onSubmit = async () => {
        this.setState({submitting: true});
        try {
            await API.resetApplicantFinancials();
        } catch {
            this.setState({submitting: false, errorSubmitting: true});
            return;
        }
        // eslint-disable-next-line
        this.setState({submitting: false});
        this.props.onSubmit();
    };

    render () {
        return (
            <>
                <SkinnyH1>Start Income Verification Over</SkinnyH1>
                <Bold fontSize={18}>Are you sure you want to start over?</Bold><br/><br/>
                <Divider />
                {this.state.errorSubmitting && (
                    <GenericFormMessage
                        type="error"
                        messages={['Oops! We had some trouble removing your financial records. Try again in a little bit.']}
                    />
                )}
                <P>Starting over means that you will lose any income sources or assets that have already been added.</P>
                <ActionButton disabled={this.state.submitting} onClick={this.onSubmit} marginBottom={20} marginTop={100}>
                    Start Over
                </ActionButton>
                <ActionButton onClick={this.props.onCancel} variant="outlined" marginBottom={20}>
                    Cancel
                </ActionButton>
            </>
        );
    }
}

export default ResetApplicantFinancials;
