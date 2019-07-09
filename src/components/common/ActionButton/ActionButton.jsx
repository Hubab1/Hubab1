import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { greenDisabled, root, label, mainDisabled, ButtonContainer } from './styles';

export default class ActionButton extends React.Component {
    render () {
        const { color, disabled, onClick, children, marginTop, marginBottom, variant, successGreen } = this.props;
        const disabledCss = successGreen ? greenDisabled : mainDisabled;
        return (
            <ButtonContainer marginTop={marginTop} marginBottom={marginBottom}>
                <Button
                    onClick={onClick}
                    classes={{ root, label, disabled: disabledCss }}
                    variant={variant}
                    color={color}
                    type="submit"
                    disabled={disabled}
                    fullWidth
                >
                    {children}
                </Button>
            </ButtonContainer>
        );
    }
}

ActionButton.propTypes = {
    color: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number,
    variant: PropTypes.string,
}

ActionButton.defaultProps = {
    variant: 'contained',
    color: 'primary',
    successGreen: false,
}