import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import MultiSelectContext from './context';
import { contentContainer, label, prefix, selected, unselected, multiSelectChoiceContainer } from './styles';

export default class MultiSelectChoice extends React.Component {
    static contextType = MultiSelectContext;
    
    render () {
        return (
            <div className={multiSelectChoiceContainer}>
                <Button
                    onClick={()=>this.context._onClick(this.props.name)}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    classes={{
                        root: this.props._selected ? selected : unselected,
                        label: contentContainer
                    }}
                >
                    <div className={prefix}>{this.props.prefix}</div>
                    <div className={label}>{this.props.label}</div>
                </Button>
            </div>
        );
    }
}

MultiSelectChoice.propTypes = {
    _selected: PropTypes.bool,
    prefix: PropTypes.string,
    label: PropTypes.string
}