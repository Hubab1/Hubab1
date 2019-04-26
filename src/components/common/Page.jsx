import React from 'react';
import { connect } from 'react-redux';


import { Banner, page, subPage } from 'assets/emotion/styles';
import { community } from 'constants.js';

export class Page extends React.Component {

    render () {
        if (window.location.pathname.includes('welcome')) return (this.props.children)
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
