import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import funnelImage from 'assets/images/PoweredByFunnel.png';
import homeImage from 'assets/images/home-image.png';
import { H1, H2, P, Logo }from 'assets/styles';
import {
    BackgroundImage, BackgroundImageTint, WelcomeFlexContainer, WelcomeTextContainer,
    WelcomeFooterContainer, HomeImageContainer, WhiteButton, LogoContainer
} from './styles';
import { ROUTES } from 'app/constants';
import { AppTheme } from 'contexts/AppContextProvider';


export class WelcomePage extends Component {
    static contextType = AppTheme;

    getFirstName () {
        const { client, invitee } = this.props.configuration;
        if ( client && client.person ) { 
            return client.person.first_name;
        } else if ( invitee && invitee.first_name ) {
            return invitee.first_name;
        } else {
            return null;
        }
    }
    
    render() {
        const { background, logo, community, unit } = this.props.configuration;
        const { building_name, city, state, postal_code, normalized_street_address } = community;

        const firstName = this.getFirstName();
        const cityStateZip = `${city}, ${state} ${postal_code}`
        const helloContent = firstName ? `Hello ${firstName},` : 'Hi There,'
        return (
            <Fragment>
                <BackgroundImage opacity={this.context.welcomeBackgroundImageOpacity} url={background}/>
                <BackgroundImageTint background={this.context.welcomeBackgroundImageTintBackground}/>
                <WelcomeFlexContainer>
                    <LogoContainer>
                        <Logo src={logo} alt="company logo"/>
                    </LogoContainer>
                    <WelcomeTextContainer>
                        <HomeImageContainer>
                            <img src={homeImage} width="30" alt="company logo"/>
                        </HomeImageContainer>
                        <H2>
                            {helloContent}
                        </H2>
                        <P>Your new home awaits at</P>
                        { building_name && <H1 className="welcome__building-header">{building_name}</H1> }
                        {
                            building_name ?
                                <P>{normalized_street_address}</P> :
                                <H1 className="welcome__building-header">{normalized_street_address}</H1>
                        }
                        {cityStateZip && <P>{cityStateZip}</P>}
                        { unit && unit.unit_number && <P>{`Unit ${unit.unit_number}`}</P>}
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer>
                        <Link 
                            to={{pathname: ROUTES.SIGNUP}}
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <WhiteButton fullWidth>
                                    Start Application
                                </WhiteButton>
                            </div>
                        </Link>
                        <img src={funnelImage} width="150" style={{marginTop:'20px'}} alt="funnel logo" />
                    </WelcomeFooterContainer>
                </WelcomeFlexContainer>
            </Fragment>

        );
    }
}

WelcomePage.propTypes = {
    configuration: PropTypes.object.isRequired,
    theme: PropTypes.shape({
        palette: PropTypes.object
    }).isRequired
}

const mapStateToProps = state => ({
    configuration: state.configuration
});

export default connect(mapStateToProps, null)(WelcomePage);
