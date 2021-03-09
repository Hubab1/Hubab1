import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import { Banner } from './styles';
import { Logo } from 'assets/styles';
import { AppTheme } from 'common-components/App/AppContextProvider';

export const container = css`
    text-align: center;
    margin: auto;
    padding-bottom: 25px;
`;

export const subContainer = css`
    padding: 30px 20px;
    max-width: 500px;
    margin: auto;
`;

export class UnauthenticatedPage extends Component {
    static contextType = AppTheme;

    render() {
        return (
            <div className={container}>
                <Banner
                    style={{
                        backgroundColor: this.context.bannerBackground,
                        color: this.context.bannerColor,
                    }}
                >
                    <Logo src={this.context.logo} alt="company logo" />
                </Banner>
                <div className={subContainer}>{this.props.children}</div>
            </div>
        );
    }
}

UnauthenticatedPage.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

export default UnauthenticatedPage;
