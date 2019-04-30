import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';

import funnelImage from '../../assets/images/PoweredByFunnel.png';
import homeImage from '../../assets/images/home-image.png';
import {
    BackgroundImage, BackgroundImageTint, WelcomeFlexContainer, WelcomeTextContainer,
    WelcomeTitle, ApplicationInfo, WelcomeLogo, WelcomeFooterContainer, HomeImageContainer
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
                    <WelcomeLogo className="welcome__logo">
                        <img src={logo} width="150" alt="company logo"/>
                    </WelcomeLogo>
                    <WelcomeTextContainer className="welcome__text_container">
                        <HomeImageContainer className="welcome__home-image">
                            <img src={homeImage} width="30" alt="company logo"/>
                        </HomeImageContainer>
                        <WelcomeTitle className="welcome__title">
                            {helloContent}
                        </WelcomeTitle>
                        Your new home awaits at
                        <ApplicationInfo>
                            {name && <div className="welcome__application-info__name">{name}</div>}
                            {street && <div className="welcome__application-info__street">{street}</div>}
                            {cityStateZip && <div className="welcome__application-info__city-state-zip">{cityStateZip}</div>}
                            {unit_number && <div className="welcome__application-info__unit-number">{`Unit ${unit_number}`}</div>}
                        </ApplicationInfo>
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer className="welcome__footer-container">
                        <ActionButton className="welcome__start-application-button"
                            onClick={() => history.push('login')}>Start Application
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
