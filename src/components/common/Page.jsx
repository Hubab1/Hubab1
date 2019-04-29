import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import { Banner, page, subPage } from 'assets/emotion/styles';
import { community } from 'constants.js';

export class Page extends React.Component {

    render () {
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.props.theme.palette.primary.main,
                    color: this.props.theme.palette.primary.contrastText
                }}>
                    {community.name}
                </Banner>
                <div className={subPage}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}


export default withTheme()(Page);
