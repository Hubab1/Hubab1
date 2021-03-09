import { createMuiTheme } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';

export const createTheme = (config) => {
    if (isEmpty(config)) return;

    const { primary_color, secondary_color, dark_mode } = config;
    const darkMode = dark_mode;
    const primaryColor = primary_color ? `#${primary_color}` : '#2B44FF';
    const secondaryColor = secondary_color ? `#${secondary_color}` : '#2B44FF';

    const theme = createMuiTheme({
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
    });

    // Overwrite component styling globally so when using the styling will be consistent
    theme.overrides = {
        MuiCardHeader: {
            title: {
                fontSize: 16,
                fontWeight: 600,
            },
            subheader: {
                fontSize: 16,
                fontWeight: 400,
            },
        },
        // Note: the default padding of the card content is 16px, 16px, 24px, 16px
        // This override addresses that by forcing it all to 16px
        MuiCardContent: {
            root: {
                '&:last-child': {
                    padding: `${theme.spacing(2)}px !important`,
                },
            },
        },
    };

    return theme;
};
