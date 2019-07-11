import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { StripeProvider } from 'react-stripe-elements';


import { STRIPE_PUBLISHABLE_KEY } from 'app/constants';

export const AppTheme = React.createContext();

function getThemeValues (config, materialTheme) {
    if (config.dark_mode) {
        return {
            logo: config.logo,
            bannerBackground: materialTheme.palette.primary.main,
            bannerColor: materialTheme.palette.primary.contrastText,
            welcomeBackgroundImageOpacity: 1,
            welcomeBackgroundImageTintBackground: materialTheme.palette.primary.main,
            progressBarTrackBackground: '#ffffff',
            progressBarTrackOpacity: 1,
            progressBarBackground: materialTheme.palette.primary.main,
            progressBarOpacity: 0.7
        }
    } else {
        return {
            logo: config.logo,
            bannerBackground: '#ffffff',
            color: '#000000',
            welcomeBackgroundImageOpacity: 0.3,
            welcomeBackgroundImageTintBackground: undefined,
            progressBarTrackBackground: materialTheme.palette.primary.main,
            progressBarTrackOpacity: 0.3,
            progressBarBackground: materialTheme.palette.primary.main,
            progressBarOpacity: 1
        }
    }
}

function AppContextProvider (props) {
    return (
        <MuiThemeProvider theme={props.theme}>
            <AppTheme.Provider value={getThemeValues(props.config, props.theme)}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <StripeProvider apiKey={STRIPE_PUBLISHABLE_KEY}>
                        {props.children}
                    </StripeProvider>
                </MuiPickersUtilsProvider>
            </AppTheme.Provider>
        </MuiThemeProvider>
    )
}

const mapStateToProps = state => ({
    config: state.configuration
})

export default connect(mapStateToProps)(AppContextProvider);