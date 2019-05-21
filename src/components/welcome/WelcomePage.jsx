import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
import { ROUTES } from 'app/constants';


export class WelcomePage extends Component {

    getNextLinkUrl () {
        return ROUTES.SIGNUP;
    }

    getLinkState () {
        const client = this.props.configuration.client;
        if (!client || !client.person) return;
        const { first_name, last_name, email, phone_1 } = client.person;
        return {first_name, last_name, email, phone_1, id: client.id};
    }
    
    render() {
        const { client, background, logo, community, unit } = this.props.configuration;
        const { building_name, city, state, postal_code, normalized_street_address } = community;
        const person = client ? client.person : null;
        const cityStateZip = `${city}, ${state} ${postal_code}`
        const helloContent = person && person.first_name ? `Hello ${person.first_name},` : 'Hi There,'

        return (
            <Fragment>
                <BackgroundImage url={background}/>
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
                        { building_name && <H1>{building_name}</H1> }
                        {
                            building_name ? <P label="street">{normalized_street_address}</P> : <H1>{normalized_street_address}</H1>
                        }
                        {cityStateZip && <P>{cityStateZip}</P>}
                        {unit && unit.number && <P>{`Unit ${unit.unit_number}`}</P>}
                    </WelcomeTextContainer>
                    <WelcomeFooterContainer>
                        <Link to={{pathname: this.getNextLinkUrl(), state: this.getLinkState()}}>
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

WelcomePage.propTypes = {
    configuration: PropTypes.object.isRequired,
    theme: PropTypes.shape({
        palette: PropTypes.object
    }).isRequired
}

const mapStateToProps = state => ({
    configuration: state.configuration,
});

const connectedWelcomePage = connect(mapStateToProps, null)(WelcomePage);
export default withTheme()(connectedWelcomePage);
