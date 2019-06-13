import {
    css
} from 'emotion';

export const contentContainer = css`
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;
    text-transform: none;
`

export const multiSelectChoiceContainer = css`
    margin-bottom: 10px;
`
export const label = css`
    flex: 1;
    padding-left: 0;
    color: #454B57;
    font-weight: 400;
    text-align: left;
    display: flex;
    font-size: 14px;
`

export const prefix = css`
    font-size: 55px;
    height: 55px;
    line-height: 67px;
    width: 120px;
    text-align: center;
`

export const unselected = css`
    box-shadow: 0px 2px 4px 2px rgba(0,0,0,.1) !important;
    border-width: 0px !important;
    padding-left: 0px !important;
    height: 80px;
`

export const selected = css`
    border-width: 1px !important;
    padding-left: 0px !important;
    height: 80px;
`