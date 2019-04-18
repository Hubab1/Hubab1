import React from 'react';

import { Banner, page, subPage } from 'assets/index';

export default class Page extends React.Component {
    render () {
        return (
            <div className={page}>
                <div className={subPage}>
                    <Banner>555 Waverly</Banner>
                    {this.props.children}
                </div>
            </div>
        );
    }
}