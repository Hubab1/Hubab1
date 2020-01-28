import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { H1, H3 } from 'assets/styles';
import { ImageContainer } from './styles';
import inviteConfirm from 'assets/images/invite-confirm.png';
import ActionButton from 'components/common/ActionButton/ActionButton';
import { HashLink } from 'react-router-hash-link';


const SpacedH3 = styled(H3)`
    margin: 15px 15% 20px 15%;
`

export default function ConfirmationPage (props) {
    const {
        successMessage, secondarySuccessMessage, buttonClick, buttonText, 
        secondaryButtonClick, secondaryButtonText, confirmationImage } = props;
    return (
        <Fragment>
            <H1>{successMessage}</H1>
            { secondarySuccessMessage && <SpacedH3>{secondarySuccessMessage}</SpacedH3>}
            { confirmationImage && 
                <ImageContainer>
                    <img src={confirmationImage} alt="confirmation"/> 
                </ImageContainer>
            }
            { props.buttonClick && 
                <ActionButton marginTop={30} onClick={buttonClick}>{buttonText}</ActionButton>
            }
            { props.linkButtonRoute &&
                <HashLink to={props.linkButtonRoute} style={{textDecoration:'none'}}>
                    <ActionButton marginTop={30}>{buttonText}</ActionButton>
                </HashLink>
            }
            { 
                secondaryButtonClick && 
                <ActionButton marginTop={15} onClick={secondaryButtonClick} variant="outlined">
                    {secondaryButtonText}
                </ActionButton> }
        </Fragment>
    );
}

ConfirmationPage.defaultProps = {
    confirmationImage: inviteConfirm
}

ConfirmationPage.propTypes = {
    successMessage: PropTypes.string,
    secondarySuccessMessage: PropTypes.string,
    buttonClick: PropTypes.func,
    buttonText: PropTypes.string,
    secondaryButtonClick: PropTypes.func,
    secondaryButtonText: PropTypes.string,
    confirmationImage: PropTypes.string,
    linkButtonRoute: PropTypes.string
}