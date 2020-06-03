import {
    css
} from 'emotion';

export const label = css`
    flex: 1;
    padding-left: 0;
    color: #454B57;
    font-weight: 400;
    display: flex;
    font-size: 16px;
`
export const paperRoot = css`
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,.1) !important;
    border-width: 0px !important;
    padding: 15px !important;
    font-size: 16px !important;
    border-radius: 5px;
    .MuiButton-root {
        font-weight: 600;
    }
`

export const existingItemRow = css`
    border-top: 1px solid #EEEEEE;
    padding: 10px 0;
    display: flex;
    text-align: left;
    justify-content: space-between;
`

export const applicationStatus = css`
    color: #828796;
    font-size: 12px;
`

export const existingItemsContainer = css`
    margin-bottom: 15px;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
    .MuiExpansionPanelSummary-root {
        padding: 0;
    }
`

export const nameContainer = css`
    text-align: left;
`

export const inviteeContact = css`
    font-size: 14px;
    color: #828796;
`

export const link = css`
    display: inline-block;
    color: #2B44FF;
    font-size: 14px;
    text-decoration: underline !important;
`   

export const rightAlign = css`
    text-align: right;
`

export const priceBreakdownContainer = css`
    .MuiExpansionPanelSummary-root {
        padding: 0;
        border-top: 1px solid #EEEEEE;
    }
`
