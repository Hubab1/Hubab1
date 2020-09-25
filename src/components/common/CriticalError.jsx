import React from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import image from 'assets/images/systemerror.png';
import { H1, H3, Spacer } from 'assets/styles';

const centerAlign = css`
    text-align: center;
    padding: 20px 20% 25px 20%;
    max-width: 400px;
    margin: 110px auto;
`;

const Img = styled.img`
    width: 155px;
    height: auto;
`;

export default function CriticalError () {
    return (
        <div className={centerAlign}>
            <H1>System Unavailable</H1>
            <H3>Oops! We&apos;re having some trouble connecting to our system. Check back soon.</H3>
            <Spacer height={25} />
            <Img alt="system error" src={image} />
        </div>
    );
}
