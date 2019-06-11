import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/styles';
import { connect } from 'react-redux';

import Logo from 'components/common/Logo';
import { Banner, page, subPage } from './styles';
import { AppContext } from 'contexts/AppContextProvider';

export class Page extends React.Component {
    static contextType = AppContext;
    render () {
        return (
            <div className={page}>
                <Banner style={{
                    backgroundColor: this.context.dark ? this.props.theme.palette.primary.main : '#ffffff',
                    color: this.context.dark ? this.props.theme.palette.primary.contrastText : '#000000'
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

Page.propTypes = {
    theme: PropTypes.object.isRequired,
    logo: PropTypes.string
}

const mapStateToProps = state => ({
    logo: state.configuration.logo
});


export default connect(mapStateToProps, null)(withTheme(Page));
