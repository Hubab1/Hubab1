import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import { H1, P } from 'assets/styles';
import { ImageContainer } from './styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export default function ConfirmationPage (props) {
    const {
        successMessage, secondarySuccessMessage, buttonClick, buttonText, 
        secondaryButtonClick, secondaryButtonText, confirmationImage } = props;
    return (
        <Fragment>
            <H1>{`Success! ${successMessage}`}</H1>
            { secondarySuccessMessage && <P>{secondarySuccessMessage}</P>}
            { confirmationImage && 
                <ImageContainer>
                    <img src={confirmationImage} alt="confirmation"/> 
                </ImageContainer>
            }
            <ActionButton marginTop="30px" onClick={buttonClick}>{buttonText}</ActionButton>
            { 
                secondaryButtonClick && 
                <ActionButton marginTop="15px" onClick={secondaryButtonClick} variant="outlined">
                    {secondaryButtonText}
                </ActionButton> }
        </Fragment>
    );
}

ConfirmationPage.propTypes = {
    successMessage: PropTypes.string,
    secondarySuccessMessage: PropTypes.string,
    buttonClick: PropTypes.func,
    buttonText: PropTypes.string,
    secondaryButtonClick: PropTypes.func,
    secondaryButtonText: PropTypes.string,
    confirmationImage: PropTypes.string,
}