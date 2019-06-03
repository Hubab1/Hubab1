import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { root, label, ButtonContainer } from './styles';

export default class ActionButton extends React.Component {
    render () {
        const { color, disabled, onClick, children, marginTop, marginBottom, variant } = this.props;
        return (
            <ButtonContainer marginTop={marginTop} marginBottom={marginBottom}>
                <Button
                    onClick={onClick}
                    classes={{ root, label }}
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
    marginTop: PropTypes.string,
    marginBottom: PropTypes.string,
    variant: PropTypes.string,
}

ActionButton.defaultProps = {
    variant: 'contained',
    color: 'primary',
}