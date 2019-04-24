import React from 'react';
import Button from '@material-ui/core/Button';

import { Link } from 'assets/index';


export default class RentalProfileOptions extends React.Component {
    render () {
        return (
            <div>
                <div>
                    {['option1', 'option2', 'option3'].map((el, i) => (
                        <li key={i}>{el}</li>
                    ))}
                </div>
                <Button onClick={this.changeScreen} variant="contained" color="primary" type="submit" fullWidth>
                    {this.props.buttonText}
                </Button>
                <br/>
                <br/>
                <Link>Go Back</Link>
            </div>
        );
    }
}
