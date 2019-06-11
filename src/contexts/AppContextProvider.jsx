import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

export const AppContext = React.createContext();

function AppContextProvider (props) {
    return (
        <MuiThemeProvider theme={props.theme}>
            <AppContext.Provider value={{dark: true}}>
                {props.children}
            </AppContext.Provider>
        </MuiThemeProvider>
    )
}

export default AppContextProvider;