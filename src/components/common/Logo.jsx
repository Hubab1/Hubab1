import React from 'react';
import styled from '@emotion/styled';


const LogoContainer = styled.div`
    label: community-logo;
    text-align: center;
    height: 63px;
    margin: 21px auto 21px auto;
`;

const Logo = (props) => {
    return (
        <LogoContainer>
            <img src={props.logo} alt="company logo"/>
        </LogoContainer>
    );
}

export default Logo;
