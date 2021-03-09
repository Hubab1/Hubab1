import React from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';

import { H1, H3 } from 'assets/styles';
import Img404 from 'assets/images/404.png';

const SpacedH3 = styled(H3)`
    margin: 20px 20% 25px 20%;
`;

const centerAlign = css`
    text-align: center;
    margin-top: 200px;
`;

export default function NotFoundPage() {
    return (
        <div className={centerAlign}>
            <H1>Page Not Found</H1>
            <SpacedH3>The requested URL was not found on this server.</SpacedH3>
            <img alt="404 page" src={Img404} />
        </div>
    );
}
