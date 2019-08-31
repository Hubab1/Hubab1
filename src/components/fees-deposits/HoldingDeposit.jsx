import React from "react";
import Info from '@material-ui/icons/Info';
import styled from '@emotion/styled';

import { CardRowBorderless, P, infoIconRoot } from 'assets/styles';
import PaidText from './PaidText';
import SimplePopover from 'components/common/SimplePopover';


const CardRowBorderlessPadded = styled(CardRowBorderless)`
    padding: 15px 0;
`

export const HoldingDeposit = ({
    holdingDepositPaid,
    formatCurrency,
    holdingDepositAmount,
    receipt
}) => {
    const holdingDepositCopy = `The $${holdingDepositAmount} holding deposit takes your apartment off the market while the application process is happening. Our community requires the main applicant to pay the holding deposit.`;

    return <CardRowBorderlessPadded>
        <P>
        Holding Deposit
            {" "}
            <SimplePopover text={holdingDepositCopy}>
                <Info classes={{root: infoIconRoot}} style={{color: '#828796', width: 16}} />
            </SimplePopover>
        </P>
        <div>
            {holdingDepositPaid && !receipt ? <PaidText /> : <P>{formatCurrency(holdingDepositAmount, 0)}</P>}
        </div>
    </CardRowBorderlessPadded>;
}

export default HoldingDeposit;