import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import StripeInput from './StripeInput';

class StripeElementWrapper extends PureComponent {
    static propTypes = {
        component: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        handleChangeUpdate: PropTypes.func,
    };

    state = {
        focused: false,
        empty: true,
        error: false,
    };

    handleBlur = () => {
        this.setState({ focused: false });
    };

    handleFocus = () => {
        this.setState({ focused: true });
    };

    handleChange = (changeObj) => {
        this.setState({
            error: changeObj.error,
            empty: changeObj.empty,
        });
        this.props.handleChangeUpdate(changeObj);
    };

    render() {
        const { component, label } = this.props;
        const { focused, empty, error } = this.state;
        return (
            <div>
                <FormControl fullWidth margin="normal">
                    <InputLabel focused={focused} shrink={focused || !empty} error={!!error}>
                        {label}
                    </InputLabel>
                    <Input
                        fullWidth
                        inputComponent={StripeInput}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        inputProps={{ component }}
                        error={!!error}
                    />
                    {error && <FormHelperText error>{error.message}</FormHelperText>}
                </FormControl>
            </div>
        );
    }
}

export default StripeElementWrapper;
