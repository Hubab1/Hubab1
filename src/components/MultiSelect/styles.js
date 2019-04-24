import {
    css
  } from 'emotion';

export const contentContainer = css`
    display: flex;
    flex: 1;
    align-items: center;
    min-height: 80px;
    text-transform: none;
`

export const label = css`
    flex: 1;
    padding-left: 0;
    color: #454B57;
    text-align: left;
    display: flex;
    font-size: 14px;
`

export const prefix = css`
    font-size: 50px;
    width: 120px;
    text-align: center;
`

export const unselected = css`
    padding-left: 0px !important;
`

export const selected = css`
    padding-left: 0px !important;
    border-width: 3px !important;
`