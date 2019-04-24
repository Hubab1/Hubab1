import React from 'react';

import { Banner, page } from 'assets/emotion/styles';
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