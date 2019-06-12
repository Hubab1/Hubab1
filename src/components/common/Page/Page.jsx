import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/styles';

import Logo from 'components/common/Logo';
import { Banner, page, subPage } from './styles';
import { AppTheme } from 'contexts/AppContextProvider';

export class Page extends React.Component {
    static contextType = AppTheme;
    render () {
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.context.bannerBackground,
                    color: this.context.bannerColor
                }}>
                    <Logo logo={this.context.logo} />
                </Banner>
                <div className={subPage}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Page.propTypes = {
    theme: PropTypes.object.isRequired,
    logo: PropTypes.string
}


export default withTheme(Page);
