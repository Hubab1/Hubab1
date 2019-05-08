import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

function AppContextProvider (props) {
    return (
        <MuiThemeProvider theme={props.theme}>
            {props.children}
        </MuiThemeProvider>
    )
}

export default AppContextProvider;