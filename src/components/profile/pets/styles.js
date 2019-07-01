import { css } from 'emotion';


export const viewPetPolicy = css`
    color: #2B44FF;
    cursor: pointer;
    text-decoration: underline
`

export const petTypeContainer = css`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
`

export const petButtonRoot = css`
    flex-grow: 1;
    border-radius: 2px !important;
    text-transform: capitalize !important;
    padding: 10px 0;
    border: 1px solid #828796 !important;
    height: 45px;
    &:last-child {
        border-left: 0px !important;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }
    &:first-of-type {
        border-right: 0px !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }
    &:not(:first-of-type):not(:last-child) {
        border-radius: 0px !important;
    }
    box-shadow: none !important;
`

export const petsImageMargin = css`
    margin: 20px 0 35px 0;
`

export const policyDiv = css`
    margin-bottom: 20px
`

export const petTypeLabel = css`
    color: #828796;
    font-size: 12px;
    margin-bottom: 11px;
    text-align: left;
`

export const petTypeLabelHeader = css`
    justify-content: space-between;
    display: flex;
`

export const fourteenFont = css`
    font-size: 14px !important;
`