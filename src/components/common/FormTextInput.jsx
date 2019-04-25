import React from 'react';
import { root } from 'assets/emotion/FormTextInput';

import TextField from '@material-ui/core/TextField';

export default class FormTextInput extends React.Component {
    render () {
        const { error, touched, handleChange, handleBlur, value, label, name, type } = this.props;
        return (
            <TextField
                error={touched && error}
                helperText={error}
                label={label}
                classes={ {root} }
                type={type && type}
                name={name}
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                value={value}
            />
        );
    }
}