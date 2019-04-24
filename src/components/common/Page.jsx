import React from 'react';

import { Banner, page, subPage } from 'assets/index';
import { community } from '../../constants';

export class Page extends React.Component {

    render () {
        return (
            <div className={page}>
                <Banner>{community.name}</Banner>
                <div className={subPage}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}


export default Page;
