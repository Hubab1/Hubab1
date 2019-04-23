import React from 'react';
import Button from '@material-ui/core/Button';
import MultiSelectContext from './context';

import { contentContainer, label, prefix, root, selected, unselected } from './styles';

export default class MultiSelect extends React.Component {
    
    onClick = (name) => {
        alert(name)
    }
    render () {
        return (
            <MultiSelectContext.Provider value={{_onClick: this.onClick}}>
                {this.props.children}
            </MultiSelectContext.Provider>
        );
    }
}