import React, {Fragment} from 'react';
import PropTypes from 'prop-types';


import { H1 } from 'assets/styles';
import ActionButton from 'components/common/ActionButton/ActionButton';

export default function ConfirmationPage (props) {
    const { successMessage, history, buttonRoute, buttonText } = props;
    return (
        <Fragment>
            <H1>{`Success! ${successMessage}`}</H1>
            <ActionButton marginTop="30px" onClick={() => history.push(buttonRoute)}>{buttonText}</ActionButton>
        </Fragment>
    );
}

ConfirmationPage.propTypes = {
    successMessage: PropTypes.string,
    history: PropTypes.object,
    buttonRoute: PropTypes.string,
    buttonText: PropTypes.string,
}