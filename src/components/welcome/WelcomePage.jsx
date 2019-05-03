import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import funnelImage from '../../assets/images/PoweredByFunnel.png';
import homeImage from '../../assets/images/home-image.png';
import Logo from 'components/common/Logo';
import { H1, H2, P }from 'assets/styles';
import {
    BackgroundImage, BackgroundImageTint, WelcomeFlexContainer, WelcomeTextContainer,
    WelcomeFooterContainer, HomeImageContainer
} from './styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { ROUTES } from 'constants.js';


export class WelcomePage extends Component {

    getNextLinkUrl () {
        const hasClient = !!this.props.leaseSettings.client;
        const url = hasClient ? ROUTES.LOGIN : ROUTES.SIGNUP;
        return url;
    }
    
    render() {
        const { client, background_image, logo, name, street, city, state, postal_code, unit_number } = this.props.leaseSettings;
        const cityStateZip = `${city}, ${state} ${postal_code}`
        const helloContent = client ? `Hello ${client.first_name},` : 'Hi There,'

        return (
            <Fragment>
                <BackgroundImage url={background_image}/>
                <BackgroundImageTint primaryColor={this.props.theme.palette.primary.main}/>
                <WelcomeFlexContainer>
                    <Logo logo={logo}/>
                    <WelcomeTextContainer>
                        <HomeImageContainer>
                            <img src={homeImage} width="30" alt="company logo"/>
                        </HomeImageContainer>
                        <H2>
                            {helloContent}
                        </H2>
                        <P>Your new home awaits at</P>
                        {name && <H1>{name}</H1>}
                        {
                            name ? <P label="street">{street}</P> :
                            <H1>{street}</H1>
                        }
                        {cityStateZip && <P>{cityStateZip}</P>}
                        {unit_number && <P>{`Unit ${unit_number}`}</P>}
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer>
                        <Link to={this.getNextLinkUrl()}>
                            <ActionButton
                                color="secondary"
                            >
                                Start Application
                            </ActionButton>
                        </Link>
                        <img src={funnelImage} width="200" style={{marginTop:'20px'}} alt="funnel logo" />
                    </WelcomeFooterContainer>
                </WelcomeFlexContainer>
            </Fragment>

        );
    }
}

const mapStateToProps = state => ({
    leaseSettings: state.leaseSettings,
});

const connectedWelcomePage = connect(mapStateToProps, null)(WelcomePage);
export default withTheme()(connectedWelcomePage);
