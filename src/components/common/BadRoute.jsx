import React from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';

const BigText = styled.div`	
    font-size: 50px;	
    font-weight: bold;	
` 	

const centerAlign = css`
    text-align: center;
    margin-top: 200px;
`

export default function BadRoute () {
    return (
        <div className={centerAlign}>
            <BigText>404</BigText>
        </div>
    );
}