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
    text-align: left;
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
`

export const selected = css`
    border-width: 1px !important;
    padding-left: 0px !important;
    height: 80px;
`