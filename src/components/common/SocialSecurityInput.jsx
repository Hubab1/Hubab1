import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';


// SSN mask adapted from this: https://codepen.io/anon/pen/zVeJpz
function replaceAt (str, index, character) {
    return str.substr(0, index) + character + str.substr(index+character.length);
}

const transformDisplay = (val) => {
    if (!val) return '';
    // Strip all non numbers
    let displayVal = val.replace(/[^0-9|\\*]/g, '');
    displayVal = displayVal.substr(0, 9);

    // Inject dashes
    if (displayVal.length >= 4) {
        displayVal = displayVal.slice(0, 3) + '-' + displayVal.slice(3);
    }

    if (displayVal.length >= 7) {
        displayVal = displayVal.slice(0, 6) + '-' + displayVal.slice(6);
    }

    // Replace all numbers with astericks
    displayVal = displayVal.replace(/[0-9]/g, '*');

    return displayVal;
}

const transformValue = (inputVal, realVal) => {
    if (typeof realVal !== 'string') {
        realVal = '';
    }

    if (!inputVal) {
        return '';
    }
    let cleanVal = inputVal.replace(/[^0-9|\\*]/g, '');
    realVal = realVal.replace(/[^0-9|\\*]/g, '');
    cleanVal = cleanVal.substr(0, 9);

    for (let i = 0; i < cleanVal.length; i++) {
        if (/[0-9]/g.exec(cleanVal.charAt(i))) {
            realVal = replaceAt(realVal, i, cleanVal[i]);
        }
    }

    realVal = realVal.substr(0, cleanVal.length);

    // Inject dashes
    if (realVal.length >= 4) {
        realVal = realVal.slice(0, 3) + '-' + realVal.slice(3);
    }

    if (realVal.length >= 7) {
        realVal = realVal.slice(0, 6) + '-' + realVal.slice(6);
    }

    return realVal;
}

export default function SocialSecurityInput (props) {
    const [showText, setShowText] = useState(false);
    const [displayVal, setDisplayVal] = useState('');

    const syncInput = (e) => {
        let val = e.target.value;
        if (!showText) {
            setDisplayVal(transformDisplay(val));
        } else {
            setDisplayVal(transformValue(val, props.value));
        }
        props.setFieldValue(transformValue(val, props.value));
    }

    const toggleVisibility = () => {
        if (!showText) {
            setDisplayVal(props.value)
        } else {
            setDisplayVal(transformDisplay(props.value));
        }
        setShowText(!showText);
    }

    return (
        <TextField
            error={props.submitted && props.error}
            onChange={syncInput}
            name={props.name}
            placeholder="555-55-5555"
            fullWidth
            label="Social Security Number"
            helperText={props.helperText}
            value={displayVal}
            InputProps={{ endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="Toggle social security number visibility"
                        onClick={toggleVisibility}
                    >
                        {showText ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )}}
        />
    )

}