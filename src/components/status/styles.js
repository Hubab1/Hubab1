import styled from '@emotion/styled';
import {css} from 'emotion';


export const CardRow = styled.div`
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
    justify-content: space-between;
    &:first-of-type {
        padding-top: 0;
    }
    &:last-of-type {
        border-bottom: none;
        padding-bottom: 0;
    }
`

export const FolderImage = styled.img`
width: 89px;
height: 85px;
`

export const BulbImage = styled.img`
    width: 46px;
    height: 42px;
`

export const statusBlurb = css`
    color: #454B57;
    font-size: 14px;
`

export const gridContainer = css`
    padding: 20px 0 20px 0;
`