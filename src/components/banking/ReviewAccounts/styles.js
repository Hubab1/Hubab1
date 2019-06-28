import { css } from 'emotion';
import styled from '@emotion/styled';

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

export const totalContainer = css`
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