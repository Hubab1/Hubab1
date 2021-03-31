import React from 'react';
import PropTypes from 'prop-types';

import Page from 'common-components/Page/Page';
import ActionButton from 'common-components/ActionButton/ActionButton';
import inviteConfirm from 'assets/images/invite-confirm.png';

export default function ConfirmationPage(props) {
    const {
        successMessage,
        secondarySuccessMessage,
        buttonClick,
        buttonText,
        secondaryButtonClick,
        secondaryButtonText,
        confirmationImage,
    } = props;
    return (
        <Page title={successMessage} subTitle={secondarySuccessMessage} image={{ src: confirmationImage }}>
            <ActionButton marginTop={30} onClick={buttonClick}>
                {buttonText}
            </ActionButton>
            {secondaryButtonClick && (
                <ActionButton marginTop={15} onClick={secondaryButtonClick} variant="outlined">
                    {secondaryButtonText}
                </ActionButton>
            )}
        </Page>
    );
}

ConfirmationPage.defaultProps = {
    confirmationImage: inviteConfirm,
};

ConfirmationPage.propTypes = {
    successMessage: PropTypes.string,
    secondarySuccessMessage: PropTypes.string,
    buttonClick: PropTypes.func,
    buttonText: PropTypes.string,
    secondaryButtonClick: PropTypes.func,
    secondaryButtonText: PropTypes.string,
    confirmationImage: PropTypes.string,
};
