import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import Logo from 'components/common/Logo';
import { Banner, page, subPage } from './styles';

export class Page extends React.Component {

    render () {
        console.log(this.props);
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.props.theme.palette.primary.main,
                    color: this.props.theme.palette.primary.contrastText
                }}>
                    <Logo logo={this.props.logo} />
                </Banner>
                <div className={subPage}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}


export default withTheme()(Page);
