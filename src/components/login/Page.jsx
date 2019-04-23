import React from 'react';

import { community } from 'components/../constants';

export default class Page extends React.Component {
    render () {
        return (
            <div className={page}>
                {this.props.children}
            </div>
        );
    }
}
