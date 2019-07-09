import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputMask from 'react-input-mask';

export default function SocialSecurityInput (props) {
    
    return (
        <InputMask 
            mask="999-99-9999"
            label="Social Security Number"
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
        >
            {(inputProps) => 
                <TextField
                    {...inputProps}
                    error={props.error}
                    fullWidth
                /> 
            }
        </InputMask>
    );
}