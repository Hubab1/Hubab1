import React, { Component } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { css } from 'emotion';

import { Logo } from 'assets/styles';
import { AppTheme } from 'components/App/AppContextProvider';

export const container = css`
    text-align: center;
    margin: auto;
    padding: 10px 0;
`;

export class BannerLogo extends Component {
    static contextType = AppTheme;

    render() {
        return (
            <div className={clsx(container, { [this.props.className]: this.props.className })}>
                <Logo src={this.context.logo} alt="company logo" />
            </div>
        );
    }
}

BannerLogo.propTypes = {
    logo: PropTypes.string,
    className: PropTypes.string,
};

export default BannerLogo;
