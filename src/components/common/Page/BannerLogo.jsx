import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { Logo } from 'assets/styles';
import { AppTheme } from 'contexts/AppContextProvider';

export const container = css`
  text-align: center;
  margin: auto;
  padding: 10px 0;
`;

export class BannerLogo extends React.Component {
    static contextType = AppTheme;
    render () {
        return (
            <div className={container}>
                <Logo src={this.context.logo} alt="company logo" />
            </div>
        );
    }
}

BannerLogo.propTypes = {
    logo: PropTypes.string
};


export default BannerLogo;
