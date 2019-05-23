import { createMuiTheme } from '@material-ui/core/styles';

export default (primaryColor='#2B44FF', secondaryColor='#2B44FF') => createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: primaryColor
        },
        secondary: {
            main: secondaryColor
        },
        white: '#FFFFFF'
    }
});