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

    const { error, handleChange, handleBlur, value, label, name, type, submitted, showValidationText, touched, endAdornment, helperText, disabled, startAdornment, inputProps } = props;
    const showValidationTextBeforeSubmit = showValidationText && (touched || value);

    const InputProps = (() => {
        const iprops = {};
        if (type === 'password') {
            Object.assign(iprops, { endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={()=>setShowPassword(!showPassword)}
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )});
        }
        if (endAdornment) {
            Object.assign(iprops, {endAdornment});
        }
        if (startAdornment) {
            Object.assign(iprops, {startAdornment});
        }
        return iprops;
    })();


    let fieldHelperText;
    if (helperText) {
        fieldHelperText = helperText;
    } else {
        fieldHelperText = showValidationTextBeforeSubmit || submitted ? error : null;
    }

    let fieldType = type;
    if (type === 'password') {
        if (showPassword) {
            fieldType = 'text';
        }
    } else {
        fieldType = type;
    }


    return (
        <TextField
            error={submitted && error}
            helperText={fieldHelperText}
            label={label}
            classes={ {root} }
            type={fieldType}
            name={name}
            fullWidth
            InputLabelProps={{
                shrink: type === 'date' ? true : undefined,
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            value={value}
            InputProps={InputProps}
            inputProps={inputProps}
            disabled={disabled}
        />
    );
}

FormTextInput.propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'tel', 'date', 'number']),
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showValidationText: PropTypes.bool,
    touched: PropTypes.bool,
    disabled: PropTypes.bool,
};

FormTextInput.defaultProps = {
    type: 'text',
    inputProps: {}
};
