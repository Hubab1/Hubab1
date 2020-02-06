import {
    css
} from 'emotion';

export const contentContainer = css`
    display: flex;
    flex: 1;
    align-items: center;
    text-transform: none;
    padding-bottom: 16px;
`

export const renterProfileListItemContainer = css`
    margin-bottom: 10px;
    a {
        text-decoration: none;
    }
`
export const label = css`
    flex: 1;
    padding-left: 0;
    color: #454B57;
    font-weight: 400;
    display: flex;
    font-size: 16px;
`

export const prefix = css`
    font-size: 55px;
    height: 55px;
    line-height: 67px;
    width: 100px;
    text-align: center;
`

export const buttonRoot = css`
    border-radius: 30px !important;
    text-transform: none !important;
    font-size: 16px !important;
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

export const anchor = css`
    position: relative;
    top: -90px;
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