import { createMuiTheme } from '@material-ui/core/styles';
import { isEmpty } from 'lodash';

export default (config) => {
    if (isEmpty(config)) return;

    const { primary_color, secondary_color, dark_mode } = config;
    const paletteType = dark_mode ? 'dark' : 'light';
    const primaryColor = primary_color ? `#${primary_color}` : '#2B44FF';
    const secondaryColor = secondary_color ? `#${secondary_color}` : '#2B44FF';

    return createMuiTheme({
        typography: {
            useNextVariants: true,
            fontFamily: ['proxima-nova', 'sans-serif'],
        },
        palette: {
            type: paletteType,
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
};
