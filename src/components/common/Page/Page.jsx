import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/styles';

import { Banner, page, subPage } from './styles';
import { Logo } from 'assets/styles';
import { AppTheme } from 'contexts/AppContextProvider';
import ProgressBar from 'components/common/Page/ProgressBar';

export class Page extends React.Component {
    static contextType = AppTheme;
    render () {
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.context.bannerBackground,
                    color: this.context.bannerColor
                }}>
                    <Logo src={this.context.logo} alt="company logo" />
                </Banner>
                <ProgressBar percent={25} />
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
