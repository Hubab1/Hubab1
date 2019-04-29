import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';

import funnelImage from '../../assets/images/PoweredByFunnel.png';
import homeImage from '../../assets/images/home-image.png';
import {
    BackgroundImage, BackgroundImageTint, WelcomeFlexContainer, WelcomeContainer,
    WelcomeTitle, WelcomeInfo, WelcomeInfoTitle, WelcomeLogo,
    WelcomeFooterContainer, HomeImageContainer
} from './styles';
import ActionButton from 'components/common/ActionButton';
import history from 'history.js';


export class WelcomePage extends Component {

    renderUnitInfo = (layout, unit_number) => {
        let unitInfo = layout;

        if (unit_number){
            unitInfo = !!unitInfo ? unitInfo.concat(` - ${unit_number}`) : unit_number;
        }
        return unitInfo;
    }

    renderWelcomeInfo = () => {
        const { name, street, city, state, postal_code, layout, unit_number } = this.props.leaseSettings;

        const infoLines = [];

        name && infoLines.push(name);
        street && infoLines.push(street);

        const unitInfo = this.renderUnitInfo(layout, unit_number);
        unitInfo && infoLines.push(unitInfo);

        infoLines.push(`${city}, ${state} ${postal_code}`);

        return (
            infoLines.map( (line, i) => {
                if ( i === 0 ) {
                    return <WelcomeInfoTitle key={i}>{line}</WelcomeInfoTitle>;
                }
                return <WelcomeInfo key={i}>{line}</WelcomeInfo>;
            })
        );
    }

    render() {
        const { client, background_image, logo } = this.props.leaseSettings;

        const helloContent = client ? `Hello ${client.first_name},` : 'Hi There,'

        return (
            <Fragment>
                <BackgroundImage url={background_image} />
                <BackgroundImageTint primaryColor={this.props.theme.palette.primary.main} />
                <WelcomeFlexContainer>
                    <WelcomeLogo>
                        <img src={logo} width="150" alt="company logo"/>
                    </WelcomeLogo>
                    <WelcomeContainer>
                        <HomeImageContainer>
                            <img src={homeImage} width="30" alt="company logo"/>
                        </HomeImageContainer>
                        <WelcomeTitle>
                            {helloContent}
                        </WelcomeTitle>
                        Your new home awaits at
                        <br/>
                        {this.renderWelcomeInfo()}
                    </WelcomeContainer>
                    <WelcomeFooterContainer>
                        <ActionButton
                            onClick={() => history.push('/login')}>Start Application
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
