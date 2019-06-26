import React, { useState } from 'react';
import PropTypes from 'prop-types';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import { root } from './styles';

export default function FormTextInput (props) {
    const [showPassword, setShowPassword] = useState(false);

    const { error, handleChange, handleBlur, value, label, name, type, submitted, showValidationText, touched, endAdornment, helperText } = props;
    const showValidationTextBeforeSubmit = showValidationText && (touched || value);

    const InputProps = (() => {
        if (endAdornment) {
            return {endAdornment};
        } else if (type === 'password') {
            return { endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={()=>setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )};
        } else {
            return undefined;
        }
    })();


    let fieldHelperText;
    if (helperText) {
        fieldHelperText = helperText;
    } else {
        fieldHelperText = showValidationTextBeforeSubmit || submitted ? error : null;
    }

    return (
        <TextField
            error={submitted && error}
            helperText={fieldHelperText}
            label={label}
            classes={ {root} }
            type={type !== 'password' || showPassword ? type : 'password'}
            name={name}
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            InputProps={InputProps}
        />
    );
}

FormTextInput.propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'tel', 'date']),
    error: PropTypes.string,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
    showValidationText: PropTypes.bool,
    touched: PropTypes.bool,
}

FormTextInput.defaultProps = {
    type: 'text'
}
