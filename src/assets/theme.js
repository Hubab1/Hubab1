import { createMuiTheme } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';

export const createTheme = (config) => {
    if (isEmpty(config)) return;

    const { primary_color, secondary_color, dark_mode } = config;
    const darkMode = dark_mode;
    const primaryColor = primary_color ? `#${primary_color}` : '#2B44FF';
    const secondaryColor = secondary_color ? `#${secondary_color}` : '#2B44FF';

    return createMuiTheme({
        // Important note: don't set palette.type to 'dark' based on dark mode
        // This will put all material ui's components in a dark mode state - which will cause a lot of styling issues
        // Instead, we use our this darkMode variable
        darkMode: darkMode,
        typography: {
            useNextVariants: true,
            fontFamily: ['proxima-nova', 'sans-serif'],
        },
        palette: {
            primary: {
                main: primaryColor,
            },
            secondary: {
                main: secondaryColor,
            },
            background: {
                default: '#ffffff',
            },
        },
        assets: {
            logo: config.logo,
            background: config.background,
        },
    });
};
