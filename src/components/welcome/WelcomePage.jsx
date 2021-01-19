import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import funnelImage from 'assets/images/PoweredByFunnel.png';
import homeImage from 'assets/images/home-image.png';
import { H1, H2, P, Logo, link } from 'assets/styles';
import {
    BackgroundImage,
    BackgroundImageTint,
    WelcomeFlexContainer,
    WelcomeTextContainer,
    WelcomeFooterContainer,
    HomeImageContainer,
    CallToActionButton,
    LogoContainer,
} from './styles';
import { ROUTES } from 'app/constants';
import { AppTheme } from 'contexts/AppContextProvider';

export class WelcomePage extends Component {
    static contextType = AppTheme;

    getFirstName() {
        const { person, invitee } = this.props.configuration;
        if (person) {
            return person.first_name;
        } else if (invitee && invitee.first_name) {
            return invitee.first_name;
        } else {
            return null;
        }
    }

    render() {
        const { background, logo, community, unit, primary_color, dark_mode } = this.props.configuration;
        const { building_name, city, state, postal_code, normalized_street_address } = community;
        const firstName = this.getFirstName();
        const cityStateZip = `${city}, ${state} ${postal_code}`;
        const helloContent = firstName ? `Hello ${firstName},` : 'Hi There,';
        const callToActionButtonStyle = dark_mode ? {} : { background: `#${primary_color}` };
        const linkStyle = dark_mode ? { color: 'white' } : { color: 'black' };

        return (
            <Fragment>
                <BackgroundImage opacity={this.context.welcomeBackgroundImageOpacity} url={background} />
                <BackgroundImageTint background={this.context.welcomeBackgroundImageTintBackground} />
                <WelcomeFlexContainer>
                    <LogoContainer>
                        <Logo src={logo} alt="company logo" />
                    </LogoContainer>
                    <WelcomeTextContainer>
                        <HomeImageContainer>
                            <img src={homeImage} width="30" alt="company logo" />
                        </HomeImageContainer>
                        <H2>{helloContent}</H2>
                        <P>Your new home awaits at</P>
                        {building_name && <H1 className="welcome__building-header">{building_name}</H1>}
                        {building_name ? (
                            <P>{normalized_street_address}</P>
                        ) : (
                            <H1 className="welcome__building-header">{normalized_street_address}</H1>
                        )}
                        {cityStateZip && <P>{cityStateZip}</P>}
                        {unit && unit.unit_number && <P>{`Unit ${unit.unit_number}`}</P>}
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer>
                        <Link
                            to={{ pathname: ROUTES.SIGNUP }}
                            style={{ textDecoration: 'none' }}
                            className="cta-container"
                        >
                            <CallToActionButton fullWidth style={callToActionButtonStyle}>
                                Start Application
                            </CallToActionButton>
                        </Link>
                        <Link to={ROUTES.LOGIN} className={link} style={linkStyle}>
                            I already started an application
                        </Link>
                        <img src={funnelImage} width="150" alt="funnel logo" />
                    </WelcomeFooterContainer>
                </WelcomeFlexContainer>
            </Fragment>
        );
    }
}

WelcomePage.propTypes = {
    configuration: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    configuration: state.configuration,
});

export default connect(mapStateToProps, null)(WelcomePage);
