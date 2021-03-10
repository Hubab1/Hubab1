import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { AppTheme } from 'app/AppContextProvider';

export const Track = styled.div`
    position: absolute;
    width: 100%;
    background-color: ${(props) => props.background};
    opacity: ${(props) => props.opacity};
    height: 100%;
    box-shadow: 0 2px 4px 0 rgba(177, 181, 189, 0.4);
`;

export const Bar = styled.div`
    position: absolute;
    width: ${(props) => `${props.percent}%`};
    background-color: ${(props) => props.background};
    opacity: ${(props) => props.opacity};
    height: 100%;
`;

export const Container = styled.div`
    position: relative;
    height: 10px;
`;

function ProgressBar(props) {
    const appThemeContext = useContext(AppTheme);

    return (
        <Container>
            <Track
                opacity={appThemeContext.progressBarTrackOpacity}
                background={appThemeContext.progressBarTrackBackground}
            ></Track>
            <Bar
                percent={props.percent}
                opacity={appThemeContext.progressBarOpacity}
                background={appThemeContext.progressBarBackground}
            />
        </Container>
    );
}

ProgressBar.propTypes = {
    percent: PropTypes.number,
};

export default ProgressBar;
