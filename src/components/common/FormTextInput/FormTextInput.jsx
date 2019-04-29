import React from 'react';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { root } from './styles';

export default class FormTextInput extends React.Component {
    state = {showPassword: false}

    handleClickShowPassword = () => this.setState({showPassword: !this.state.showPassword})

    render () {
        const { error, touched, handleChange, handleBlur, value, label, name, type, submitted } = this.props;
        return (
            <TextField
                error={submitted && error}
                helperText={touched && error}
                label={label}
                classes={ {root} }
                type={type === 'text' || this.state.showPassword ? 'text' : 'password'}
                name={name}
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
                InputProps={type === 'password' && {
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                        >
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                  </InputAdornment>
                }}
            />
        );
    }
}

FormTextInput.defaultProps = {
    type: 'text'
}
