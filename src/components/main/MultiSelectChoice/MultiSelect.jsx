import React from 'react';
import Button from '@material-ui/core/Button';
import MultiSelectContext from './context';

import { contentContainer, label, prefix, root, selected, unselected } from './styles';

export default class MultiSelect extends React.Component {
    
    onClick = (name) => {
        if (this.props.value.indexOf(name) == -1) {
            this.props.setValues({'options': [...this.props.value.slice(), name]})
        } else {
            this.props.setValues({'options': this.props.value.slice().filter(val => val != name)});
        }
    }
    render () {
        return (
            <MultiSelectContext.Provider value={{_onClick: this.onClick, _value: this.props.value}}>
                {React.Children.map(this.props.children, (child, i) => {
                    return React.cloneElement(child, {
                        _selected: this.props.value.indexOf(child.props.name) > -1
                    })
                })}
            </MultiSelectContext.Provider>
        );
    }
}