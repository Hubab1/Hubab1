import React from 'react';
import Button from '@material-ui/core/Button';
import MultiSelectContext from './context';

import { contentContainer, label, prefix, root, selected, unselected } from './styles';

export default class MultiSelectChoice extends React.Component {
    static contextType = MultiSelectContext;
    
    render () {
        return (
            <Button
                textTransform="none"
                onClick={()=>this.context._onClick(this.props.name)}
                variant="outlined"
                color="primary"
                type="submit"
                fullWidth
                classes={{
                    root: this.props.selected ? selected : unselected,
                    label: contentContainer
                }}
            >
                    <div className={prefix}>{this.props.prefix}</div>
                    <div className={label}>{this.props.label}</div>
            </Button>
        );
    }
}