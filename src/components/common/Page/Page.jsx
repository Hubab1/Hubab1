import React from 'react';
import PropTypes from 'prop-types';

import { Banner, page, subPage } from './styles';
import { Logo } from 'assets/styles';
import { AppTheme } from 'contexts/AppContextProvider';
import ProgressBar from 'components/common/Page/ProgressBar';
import NavDrawer from 'components/NavDrawer';

export class Page extends React.Component {
    static contextType = AppTheme;
    render () {
        return (
            <div className={page}>
                <Logo src={this.context.logo} alt="company logo" />
            </div>      
        );
    }
}

Page.propTypes = {
    logo: PropTypes.string
}


export default Page;
