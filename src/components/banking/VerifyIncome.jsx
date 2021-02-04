import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import PropTypes from 'prop-types';
import { styles } from 'assets/styles';
import GreenCheckIcon from 'components/common/GreenCheckIcon';
import safeImage from 'assets/images/connect-bank/safe.png';
import padlockImage from 'assets/images/connect-bank/padlock.png';
import thunderImage from 'assets/images/connect-bank/thunder.jpg';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { H1, H3, P, Bold } from 'assets/styles';
import GenericFormMessage from 'components/common/GenericFormMessage';
import { ROUTES } from 'app/constants';
import { Link } from 'react-router-dom';
import BankingContext from 'components/banking/BankingContext';

const SpacedH3 = styled(H3)`
    margin: 20px 5% 25px 5%;
`;

const bodyContainer = css`
    margin: 40px 10px 40px 30px;
    text-align: left;
    display: flex;
    flex-direction: column;
    p {
        margin-left: 15px;
    }
`;

const iconColumn = css`
    margin-top: 5px;
`;

const bodyRow = css`
    display: flex;
    margin-bottom: 20px;
`;

const VerifyIncome = ({ errors, loadingFinicityIframe, openFinicityIframe, reportNoIncomeAssets }) => {
    const context = React.useContext(BankingContext);
    if (!context.routeSelected) {
        return null;
    }

    return (
        <Fragment>
            <H1>Verify Your Income</H1>
            <SpacedH3>Verifying your income will help us ensure that you qualify for this apartment.</SpacedH3>
            <img src={safeImage} alt="vault" />
            <div className={bodyContainer}>
                <div className={bodyRow}>
                    <img src={padlockImage} alt="padlock" width="18" height="28" className={iconColumn} />
                    <P>
                        <Bold>Your data is safe.</Bold> Bank level encryption is used to connect and your credentials
                        are never stored.
                    </P>
                </div>
                <div className={bodyRow}>
                    <GreenCheckIcon />
                    <P>
                        <Bold>Your money is safe.</Bold> This does not authorize any transactions from your account.
                    </P>
                </div>
                <div className={bodyRow}>
                    <img src={thunderImage} alt="thunder" width="18" height="28" className={iconColumn} />
                    <P>
                        <Bold>Link your bank account for instant verification.</Bold> If your income is directly
                        deposited to your bank account.
                    </P>
                </div>
            </div>
            {!!errors && <GenericFormMessage type="error" messages={errors} />}
            <ActionButton disabled={loadingFinicityIframe} onClick={openFinicityIframe} marginBottom={20}>
                Link Bank Account
            </ActionButton>
            <Link to={ROUTES.INCOME_VERIFICATION_SUMMARY} className={styles.linkNoStyle}>
                <ActionButton variant="outlined" marginBottom={20}>
                    Verify Manually
                </ActionButton>
            </Link>
            <Link
                to={ROUTES.INCOME_VERIFICATION_SUMMARY}
                className={styles.linkNoStyle}
                onClick={(e) => reportNoIncomeAssets(e, ROUTES.INCOME_VERIFICATION_SUMMARY)}
            >
                <ActionButton variant="outlined" marginBottom={20}>
                    I Don&apos;t Have Income or Assets
                </ActionButton>
            </Link>
        </Fragment>
    );
};

VerifyIncome.propTypes = {
    errors: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    loadingFinicityIframe: PropTypes.bool,
    openFinicityIframe: PropTypes.func,
    reportNoIncomeAssets: PropTypes.func,
};

export default VerifyIncome;
