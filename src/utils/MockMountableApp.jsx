import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { createTheme } from 'assets/theme';
import { AppContextProvider } from 'contexts/AppContextProvider';

function MockMountableApp({ config = mockConfig, children }) {
    const theme = createTheme(config);

    return (
        <AppContextProvider theme={theme} config={config} skipStripeAndMayorLoader>
            <BrowserRouter>{children}</BrowserRouter>
        </AppContextProvider>
    );
}

MockMountableApp.propTypes = {
    config: PropTypes.shape({
        primary_color: PropTypes.string,
        secondary_color: PropTypes.string,
        darK_mode: PropTypes.bool,
        logo: PropTypes.string,
        background: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
};

export default MockMountableApp;

const mockConfig = {
    use_demo_config: true,
    dark_mode: false,
    primary_color: '286165',
    secondary_color: 'FFFFFF',
    background: 'backgroundimageurl',
    logo: 'logo',
};
