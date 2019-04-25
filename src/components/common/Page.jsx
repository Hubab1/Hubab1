import React from 'react';
import SiteThemeContext from 'contexts/SiteThemeContext';

import { Banner, page, subPage } from 'assets/emotion/styles';
import { community } from 'constants.js';

export class Page extends React.Component {
    static contextType = SiteThemeContext;

    render () {
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.context.primary,
                    color: this.context.secondary
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


export default Page;
