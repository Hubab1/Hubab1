import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';

import funnelImage from '../../assets/images/PoweredByFunnel.png';
import homeImage from '../../assets/images/home-image.png';
import Logo from 'components/common/Logo';
import { H1, H2, P }from 'assets/styles';
import {
    BackgroundImage, BackgroundImageTint, WelcomeFlexContainer, WelcomeTextContainer,
    WelcomeFooterContainer, HomeImageContainer
} from './styles';
import ActionButton from 'components/common/ActionButton/ActionButton';
import history from 'history.js';


export class WelcomePage extends Component {

    render() {
        const { client, background_image, logo, name, street, city, state, postal_code, unit_number } = this.props.leaseSettings;
        const cityStateZip = `${city}, ${state} ${postal_code}`
        const helloContent = client ? `Hello ${client.first_name},` : 'Hi There,'

        return (
            <Fragment>
                <BackgroundImage url={background_image} className="welcome__background-image"/>
                <BackgroundImageTint primaryColor={this.props.theme.palette.primary.main} className="welcome__background-image-tint"/>
                <WelcomeFlexContainer className="welcome__flex-container">
                    <Logo logo={logo}/>
                    <WelcomeTextContainer className="welcome__text_container">
                        <HomeImageContainer className="welcome__home-image">
                            <img src={homeImage} width="30" alt="company logo"/>
                        </HomeImageContainer>
                        <H2 className="welcome__title">
                            {helloContent}
                        </H2>
                        <P>Your new home awaits at</P>
                        <br/>
                        {name && <H1 className="welcome__application-info__name">{name}</H1>}
                        {
                            name ? <P className="welcome__application-info__street">{street}</P> :
                            <H1 className="welcome__application-info__street">{street}</H1>
                        }
                        {cityStateZip && <P className="welcome__application-info__city-state-zip">{cityStateZip}</P>}
                        {unit_number && <P className="welcome__application-info__unit-number">{`Unit ${unit_number}`}</P>}
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer className="welcome__footer-container">
                        <ActionButton
                            className="welcome__start-application-button"
                            onClick={() => history.push('/login')}
                            color="secondary"
                        >
                            Start Application
                        </ActionButton>
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
