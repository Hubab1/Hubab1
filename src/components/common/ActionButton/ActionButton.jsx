import React from 'react';

import Button from '@material-ui/core/Button';
import { root, label, ButtonContainer } from './styles';

export default class ActionButton extends React.Component {
    render () {
        const { color, disabled, onClick, children, marginTop, marginBottom } = this.props;
        return (
            <ButtonContainer marginTop={marginTop} marginBottom={marginBottom}>
                <Button
                    onClick={onClick}
                    classes={{ root, label }}
                    variant="contained"
                    color={color || 'primary'}
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
