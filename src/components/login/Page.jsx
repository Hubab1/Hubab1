import React from 'react';

import { page } from 'assets/emotion/styles';

export default class Page extends React.Component {
    render () {
        return (
            <div className={page}>
                {this.props.children}
            </div>
        );
    }
}
