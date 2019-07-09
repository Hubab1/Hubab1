import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

export default function SocialSecurityInput (props) {
    const [showText, setShowText] = useState(true);

    return (
        <TextField
            error={props.submitted && props.error}
            onChange={props.handleChange}
            name={props.name}
            placeholder="555-55-5555"
            fullWidth
            label="Social Security Number"
            helperText={props.helperText}
            type={showText ? 'text' : 'password'}
            value={props.value}
            InputProps={{ endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle password visibility"
                        onClick={()=>setShowText(!showText)}
                    >
                        {showText ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )}}
        />
    )

}