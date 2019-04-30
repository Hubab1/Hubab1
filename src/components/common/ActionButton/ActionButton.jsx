import React from 'react';

import Button from '@material-ui/core/Button';
import { root, label } from './styles';

export default class ActionButton extends React.Component {
    render () {
        const { color, disabled, onClick, children } = this.props;
        return (
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
        );
    }
}
