import styled from '@emotion/styled';
import { css } from 'emotion';
import { P } from 'assets/styles';

export const SpacedP = styled(P)`
    margin: 20px 0;
`

export const BoldP = styled(P)`
    font-weight: 600;
`

export const CardSection = styled.div`
    padding: 15px;
`

export const Card = styled.div`
    margin-bottom: 20px;
    border: 1px solid #EEEEEE;	
    border-radius: 5px;	
    box-shadow: 0 2px 4px 0 rgba(197,197,197,0.5);
    text-align: left;
`

export const addLink = css`
    color: #2B44FF;
    font-size: 14px;
    margin: 10px 0;
`

export const iconRoot = css`
    height: 14px !important;
    width: 14px !important;
`

export const total = css`
    background-color: rgba(86,186,130,0.1);
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    width: 100%;
    position: relative;
    left: -15px;
    bottom: -15px;
`

export const incomeEntry = css`
    display: flex;    
    justify-content: space-between;
    margin: 0 0 15px 0;
`

export const BottomAlignedP = styled(P)`
    margin-top: auto;
`