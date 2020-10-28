import { css } from 'emotion';

export const cardHeader = css`
    align-self: start;
    flex: 1;
    padding-left: 0;
    font-weight: 400;
    display: block;
    font-size: 14px;
`;

export const headerContainer = css`
    display: flex;
    flex: 1;
    align-items: center;
    text-transform: none;
    padding-bottom: 15px;
`;

export const imageWrapper = css`
    line-height: 67px;
    width: 42px;
    text-align: left;
    margin: 0;
    padding: 0;
    margin-right: 10px;
`;

export const itemsContainer = css`
    margin-bottom: 0;
    border-bottom: 1px solid #eeeeee;

    .MuiExpansionPanelSummary-root {
        padding: 0;
    }

    .MuiExpansionPanelSummary-root.Mui-expanded {
        min-height: 20px;
        height: 45px;
        margin: 0;
    }

    :nth-child(2) {
        border-top: 1px solid #eeeeee;
    }
`;

export const itemRow = css`
    padding: 10px 0;
    text-align: left;
    border-top: 1px solid #eeeeee;
    font-size: 15px;
`;

export const paidText = css`
    position: absolute;
    right: 28px;
    top: 13px;
`;

export const paymentDetailRow = css`
    display: flex;
    justify-content: space-between;
    padding-bottom: 9px;
    font-size: 14px;

    div:first-child {
        padding-right: 50px;
    }
`;

export const paymentDetailTotal = css`
    display: flex;
    justify-content: space-between;
    background-color: rgba(103, 193, 139, 0.1);
    padding: 10px 15px 10px 16px;
    width: 458px;
    margin-left: -15px;
    font-size: 15px;

    div:first-child {
        font-weight: bold;
    }
`;

export const title = css`
    font-weight: bold;
`;

export const rentalOptionName = css`
    padding-right: 20px;
`;

export const styles = {
    cardHeader,
    headerContainer,
    itemsContainer,
    itemRow,
    imageWrapper,
    paidText,
    paymentDetailRow,
    paymentDetailTotal,
    title,
    rentalOptionName,
};

export const viewPaymentTerms = css`
    color: #2b44ff;
    cursor: pointer;
    text-decoration: underline;
    padding-left: 5px;
`;

export const termsDiv = css`
    margin-bottom: 20px;
    margin-top: 44px;
    font-size: 14px;
`;
