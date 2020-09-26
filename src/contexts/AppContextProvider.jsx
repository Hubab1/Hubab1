import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { StripeProvider } from 'react-stripe-elements';
import PropTypes from 'prop-types';

import { STRIPE_PUBLISHABLE_KEY_DEMO, STRIPE_PUBLISHABLE_KEY_LIVE } from 'app/constants';

export const AppTheme = React.createContext();

function getThemeValues(config, materialTheme) {
    if (config.dark_mode) {
        return {
            dark_mode: true,
            logo: config.logo,
            bannerBackground: materialTheme.palette.primary.main,
            bannerColor: materialTheme.palette.primary.contrastText,
            welcomeBackgroundImageOpacity: 1,
            welcomeBackgroundImageTintBackground: materialTheme.palette.primary.main,
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
            welcomeBackgroundImageOpacity: 0.3,
            welcomeBackgroundImageTintBackground: undefined,
            progressBarTrackBackground: materialTheme.palette.primary.main,
            progressBarTrackOpacity: 0.3,
            progressBarBackground: materialTheme.palette.primary.main,
            progressBarOpacity: 1,
        };
    }
}

export function AppContextProvider(props) {
    const stripeApiKey =
        props.config.use_demo_config === false ? STRIPE_PUBLISHABLE_KEY_LIVE : STRIPE_PUBLISHABLE_KEY_DEMO;

    return (
        <MuiThemeProvider theme={props.theme}>
            <AppTheme.Provider value={getThemeValues(props.config, props.theme)}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <StripeProvider apiKey={stripeApiKey}>{props.children}</StripeProvider>
                </MuiPickersUtilsProvider>
            </AppTheme.Provider>
        </MuiThemeProvider>
    );
}

AppContextProvider.propTypes = {
    children: PropTypes.array,
    config: PropTypes.object,
    theme: PropTypes.object,
};

const mapStateToProps = (state) => ({
    config: state.configuration,
});

export default connect(mapStateToProps)(AppContextProvider);
