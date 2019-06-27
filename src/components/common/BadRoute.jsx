import React from 'react';
import { css } from 'emotion';

import { H1 } from 'assets/styles';

export const centerAlign = css`
    text-align: center;
    margin-top: 200px;
`

export default function BadRoute () {
    return (
        <div className={centerAlign}>
            <H1>404</H1>
        </div>
    );
}