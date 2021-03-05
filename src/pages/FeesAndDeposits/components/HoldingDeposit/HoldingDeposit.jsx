import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Info from '@material-ui/icons/Info';

import PaidText from 'components//PaidText/PaidText';
import SimplePopover from 'components//SimplePopover/SimplePopover';
import { CardRowBorderless, P, infoIconRoot } from 'assets/styles';

const CardRowBorderlessPadded = styled(CardRowBorderless)`
    padding: 15px 0;
`;

export const HoldingDeposit = ({ holdingDepositPaid = false, holdingDepositAmount }) => {
    const holdingDepositCopy = `The ${holdingDepositAmount} holding deposit takes your apartment off the market while the application process is happening. Our community requires the main applicant to pay the holding deposit.`;

    return (
        <CardRowBorderlessPadded>
            <P>
                Holding Deposit{' '}
                <SimplePopover text={holdingDepositCopy}>
                    <Info classes={{ root: infoIconRoot }} style={{ color: '#828796', width: 16 }} />
                </SimplePopover>
            </P>
            <div>{holdingDepositPaid ? <PaidText /> : <P>{holdingDepositAmount}</P>}</div>
        </CardRowBorderlessPadded>
    );
};

HoldingDeposit.propTypes = {
    holdingDepositPaid: PropTypes.bool,
    holdingDepositAmount: PropTypes.string,
};

export default HoldingDeposit;
