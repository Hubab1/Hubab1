import React from 'react';
import PropTypes from 'prop-types';

import AddCircle from '@material-ui/icons/AddCircle';

const AddAnotherButton = (props) => (
    <span
        role="button"
        style={{
            color: '#2B44FF',
            display: 'inline-block',
            cursor: 'pointer'
        }}
        onClick={props.onClick}
    >
        <span style={{fontSize: props.fontSize}}>
            <AddCircle style={{verticalAlign: 'middle', fontSize: props.fontSize + 5}} /> <span style={{verticalAlign: 'middle'}}>Add Another {props.thing}</span>
        </span>
    </span>
);

AddAnotherButton.propTypes = {
    fontSize: PropTypes.number
}

AddAnotherButton.defaultProps = {
    fontSize: 13
}

export default AddAnotherButton;