import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import { createTheme } from 'assets/theme';

function MockThemeComponent({ config, children }) {
    const theme = createTheme(config);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

MockThemeComponent.propTypes = {
    config: PropTypes.shape({
        primary_color: PropTypes.string,
        secondary_color: PropTypes.string,
        darK_mode: PropTypes.bool,
        logo: PropTypes.string,
        background: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
};

export default MockThemeComponent;
