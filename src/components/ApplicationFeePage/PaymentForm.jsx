import React, { PureComponent } from 'react';
import { withTheme } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from  'react-stripe-elements';

import { ErrorDetail } from 'assets/styles';
import API from 'app/api';


export class PaymentForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.stripe.createToken({type: 'card', name: 'client card'}).then( res => {
            if (res.token) {
                API.stripePayment(res);
            } else {
                // some error
            }
        }).catch( res => {
            // omg more errors!
        });
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
            <Grid container>
                <Grid item xs={12}>
                    <StripeElementWrapper label="Card Number" component={CardNumberElement} />
                </Grid>
                <Grid item xs={7}>
                    <StripeElementWrapper label="Expiry (MM / YY)" component={CardExpiryElement} />
                </Grid>
                <Grid item xs={5}>
                    <StripeElementWrapper label="CVC" component={CardCVCElement} />
                </Grid>
            </Grid>
                <button>tooba toothpaste</button>
            </form>

        )
    }
}

export default injectStripe(PaymentForm);

class StripeElementWrapper extends PureComponent {
  
    static propTypes = {
      component: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
    }
  
    state = {
      focused: false,
      empty: true,
      error: false,
    }
  
    handleBlur = () => {
      this.setState({ focused: false })
    }
  
    handleFocus = () => {
      this.setState({ focused: true })
    }
  
    handleChange = changeObj => {
      this.setState({
        error: changeObj.error,
        empty: changeObj.empty,
      })
    }
  
    render() {
      const { component, label } = this.props
      const { focused, empty, error } = this.state
  
      return (
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel
              focused={focused}
              shrink={focused || !empty}
              error={!!error}>
              {label}
            </InputLabel>
            <Input
              fullWidth
              inputComponent={StripeInput}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              inputProps={{ component }}
            />
          </FormControl>
          {error && <ErrorDetail>{error.message}</ErrorDetail>}
        </div>
      )
    }
  }
  

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
      classes: {
        root: {
          width: '100%',
          padding: '6px 0 7px',
          cursor: 'text',
        },  
      }
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
      debugger;
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
              fontFamily: theme.typography.fontFamily,
              color: '#000000de',
            },
          }}
        />
      )
    }
  }
  
  const StripeInput = withTheme(_StripeInput);