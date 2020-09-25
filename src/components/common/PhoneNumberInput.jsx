import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import TextField from '@material-ui/core/TextField';
import { root } from 'components/common/FormTextInput/styles';



const PhoneNumberInput = (props) => {
    const { label, name, value, handleChange, error, helperText} = props; 
    return (
        <InputMask 
            mask="(999) 999-9999"
            label={label}
            name={name}
            type="tel"
            value={value}
            onChange={handleChange}
            classes={ {root} }
        >
            {(inputProps) => 
                <TextField
                    {...inputProps}
                    error={error}
                    helperText={helperText}
                    fullWidth
                /> 
            }
        </InputMask>
    );
};

PhoneNumberInput.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.string,
};

export default PhoneNumberInput;
