import React from 'react';
import { connect } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';

export const AppTheme = React.createContext();

function getThemeValues (config, materialTheme) {
    if (config.dark) {
        return {
            logo: config.logo,
            bannerBackground: materialTheme.palette.primary.main,
            bannerColor: materialTheme.palette.primary.contrastText,
            welcomeBackgroundImageOpacity: 1,
            welcomeBackgroundImageTintBackground: materialTheme.palette.primary.main
        }
    } else {
        return {
            logo: config.logo,
            bannerBackground: '#ffffff',
            color: '#000000',
            welcomeBackgroundImageOpacity: 0.8,
            welcomeBackgroundImageTintBackground: undefined
        }
    }
}

function AppContextProvider (props) {
    return (
        <MuiThemeProvider theme={props.theme}>
            <AppTheme.Provider value={getThemeValues(props.config, props.theme)}>
                {props.children}
            </AppTheme.Provider>
        </MuiThemeProvider>
    )
}

const mapStateToProps = state => ({
    config: state.configuration
})

export default connect(mapStateToProps)(AppContextProvider);