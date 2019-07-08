import React, { PureComponent } from 'react';
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

  class _StripeInput extends PureComponent {
  
    static propTypes = {
        classes: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        component: PropTypes.func.isRequired,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onChange: PropTypes.func,
    }
  
    static defaultProps = {
        onFocus: () => {},
        onBlur: () => {},
        onChange: () => {},
    }
  
    render() {
        const {
            classes: c,
            theme,
            component: Component,
            onFocus,
            onBlur,
            onChange,
        } = this.props

        return (
            <Component
                className={c.root}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                placeholder=""
                style={{
                    base: {
                        fontSize: `${theme.typography.fontSize}px`,
                        fontFamily: theme.typography.fontFamily[0],
                        color: '#000000de',
                    },
                  }}
            />
        )
    }
}
  
const StripeInput = withStyles(styles, {withTheme: true})(_StripeInput);

export default StripeInput;