import React from 'react';

import { Banner, page, subPage } from 'assets/index';
import { community } from '../../constants';

export default class Page extends React.Component {
    render () {
        return (
            <div className={page}>
                <div className={subPage}>
                    <Banner>{community.name}</Banner>
                    {this.props.children}
                </div>
            </div>
        );
    }
}