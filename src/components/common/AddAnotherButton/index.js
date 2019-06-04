import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '@material-ui/styles';

import AddCircle from '@material-ui/icons/AddCircle';

const AddAnotherButton = withTheme((props) => (
    <span
        role="button"
        style={{
            color: props.theme.palette.primary.main,
            display: 'inline-block',
            cursor: 'pointer'
        }}
        onClick={props.onClick}
    >
        <span style={{fontSize: props.fontSize}}>
            <AddCircle style={{verticalAlign: 'middle', fontSize: props.fontSize + 5}} /> <span style={{verticalAlign: 'middle'}}>Add Another {props.thing}</span>
        </span>
    </span>
));

AddAnotherButton.propTypes = {
    fontSize: PropTypes.number
}

AddAnotherButton.defaultProps = {
    fontSize: 13
}

export default AddAnotherButton;