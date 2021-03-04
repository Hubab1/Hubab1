import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { StripeProvider } from 'react-stripe-elements';
import { STRIPE_PUBLISHABLE_KEY_DEMO, STRIPE_PUBLISHABLE_KEY_LIVE } from 'app/constants';

export const AppTheme = React.createContext();

function getThemeValues(config, materialTheme) {
    if (config.dark_mode) {
        return {
            dark_mode: true,
            logo: config.logo,
            bannerBackground: materialTheme.palette.primary.main,
            bannerColor: materialTheme.palette.primary.contrastText,
            progressBarTrackBackground: '#ffffff',
            progressBarTrackOpacity: 1,
            progressBarBackground: materialTheme.palette.primary.main,
            progressBarOpacity: 0.7,
        };
    } else {
        return {
            dark_mode: false,
            logo: config.logo,
            bannerBackground: '#ffffff',
            color: '#000000',
            progressBarTrackBackground: materialTheme.palette.primary.main,
            progressBarTrackOpacity: 0.3,
            progressBarBackground: materialTheme.palette.primary.main,
            progressBarOpacity: 1,
        };
    }
}

export function AppContextProvider({ theme, children, config, skipStripe = false }) {
    const stripeApiKey = config.use_demo_config === false ? STRIPE_PUBLISHABLE_KEY_LIVE : STRIPE_PUBLISHABLE_KEY_DEMO;

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <AppTheme.Provider value={getThemeValues(config, theme)}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    {skipStripe ? children : <StripeProvider apiKey={stripeApiKey}>{children}</StripeProvider>}
                </MuiPickersUtilsProvider>
            </AppTheme.Provider>
        </MuiThemeProvider>
    );
}

AppContextProvider.propTypes = {
    config: PropTypes.object,
    theme: PropTypes.object,
    skipStripe: PropTypes.bool, // used for testing purposes
    children: PropTypes.node,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
});

export default connect(mapStateToProps)(AppContextProvider);
