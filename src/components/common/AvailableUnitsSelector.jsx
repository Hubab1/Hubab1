import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import deburr from 'lodash/deburr';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';

import API from 'app/api';

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;
    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}


function renderSuggestion(suggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.unit_number) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.unit_number}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.unit_number}
        </MenuItem>
    );
}


function getSuggestions (allSuggestions, value, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0 && !showEmpty
        ? []
        : allSuggestions.filter(suggestion => {
            const keep =
            count < 5 && suggestion.unit_number.slice(0, inputLength).toLowerCase() === inputValue;

            if (keep) {
                count += 1;
            }

            return keep;
        });
}

export default class AvailableUnitsSelector extends React.Component {
    state = {availableUnits: []}
    componentDidMount() {
        API.fetchAvailableUnits().then(units => {
            this.setState({availableUnits: units});
        })
    }
    
    render () {
        const units = this.state.availableUnits;
        const classes = {}
        return (
            <div>
                <Downshift id="downshift-options">
                    {({
                        clearSelection,
                        getInputProps,
                        getItemProps,
                        getLabelProps,
                        getMenuProps,
                        highlightedIndex,
                        inputValue,
                        isOpen,
                        openMenu,
                        selectedItem,
                    }) => {
                        const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                            onChange: event => {
                                if (event.target.value === '') {
                                    clearSelection();
                                }
                            },
                            onFocus: openMenu,
                            placeholder: '',
                        });

                        return (
                            <div className={classes.container}>
                                {renderInput({
                                    fullWidth: true,
                                    classes,
                                    label: 'Available Units',
                                    InputLabelProps: getLabelProps({ shrink: true }),
                                    InputProps: { onBlur, onChange, onFocus },
                                    inputProps,
                                })}

                                <div {...getMenuProps()}>
                                    {isOpen ? (
                                        getSuggestions(units, inputValue, { showEmpty: true }).map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({ item: suggestion.unit_number }),
                                                highlightedIndex,
                                                selectedItem,
                                            }),
                                        )
                                    ) : null}
                                </div>
                            </div>
                        );
                    }}
                </Downshift>
            </div>
        );
    }
}