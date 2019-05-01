import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import AppContext from './AppContext';

function AppContextProvider (props) {
    return (
        <MuiThemeProvider theme={props.theme}>
            <AppContext.Provider value={{communityId: props.communityId}}>
                {props.children}
            </AppContext.Provider>
        </MuiThemeProvider>
    )
}

export default AppContextProvider;