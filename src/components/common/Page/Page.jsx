import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Logo from 'components/common/Logo';
import { Banner, page, subPage } from './styles';

export class Page extends React.Component {

    render () {
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

Page.propTypes = {
    theme: PropTypes.object.isRequired,
    logo: PropTypes.string
}

const mapStateToProps = state => ({
    logo: state.leaseSettings.logo
});


export default connect(mapStateToProps, null)(withTheme()(Page));
