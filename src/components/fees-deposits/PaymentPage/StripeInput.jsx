import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';


const styles = () => ({
    root: {
        width: '100%',
        padding: '6px 0 7px',
        cursor: 'text',
        fontFamily: 'proxima-nova'
    },
})  

const _StripeInput = props => {

    const {
        classes: c,
        inputRef,
        component: Component,
        onFocus,
        onBlur,
        onChange,
    } = props;

    const [mountNode, setMountNode] = React.useState(null);

    React.useImperativeHandle(
        inputRef,
        () => ({
            focus: () => mountNode.focus()
        }),
        [mountNode]
    );
  
    return (
        <Component
            onReady={ setMountNode }
            className={c.root}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            placeholder=""
            style={{
                base: {
                    fontSize: '16px',
                    fontFamily: 'proxima-nova, sans-serif',
                    color: 'black',
                },
                invalid: {
                    color: '#eb1c26'
                }
            }}
        />  
    )
}

_StripeInput.defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
}

_StripeInput.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
}

const StripeInput = withStyles(styles, {withTheme: true})(_StripeInput);

export default StripeInput;