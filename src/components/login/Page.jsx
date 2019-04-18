import React from 'react';

import { Banner, page, subPage } from 'assets/index';
import { community } from 'components/../constants';

export default class Page extends React.Component {
    render () {
        return (
            <div className={page}>
                <Banner>{community.name}</Banner>
                {this.props.children}
            </div>
        );
    }
}