import React, { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import deburr from 'lodash/deburr';
import TextField from '@material-ui/core/TextField';
import Downshift from 'downshift';
import fuzzaldrin from 'fuzzaldrin-plus';

import API from 'app/api';
import usePrevious from 'hooks/usePrevious';

// Autocomplete code adapted from code here https://material-ui.com/components/autocomplete/
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
            InputLabelProps={{
                shrink: undefined,
            }}
        />
    );
}

function renderSuggestion(suggestionProps) {
    const { suggestion, index, itemProps, highlightedIndex, selectedItem, inputValue } = suggestionProps;
    const inputLength = inputValue.length;
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem ? selectedItem.unit_number : '').indexOf(suggestion.unit_number) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.unit_number}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 600 : 'inherit',
            }}
        >
            {' '}
            {inputLength === 0 ? (
                suggestion.unit_number
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: fuzzaldrin.wrap(suggestion.unit_number, inputValue),
                    }}
                />
            )}
        </MenuItem>
    );
}

function getSuggestions(allSuggestions, value, { showEmpty = false } = {}) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength === 0 && showEmpty) {
        return allSuggestions.filter(
            (suggestion) => suggestion.unit_number.slice(0, inputLength).toLowerCase() === inputValue
        );
    }
    return fuzzaldrin.filter(allSuggestions, value, { key: 'unit_number' });
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
        maxHeight: 240,
        overflow: 'auto',
    },
    chip: {
        margin: theme.spacing(0.5, 0.25),
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing(2),
    },
}));

export default function AvailableUnitsSelector(props) {
    const clearSelection = useRef(undefined);
    const previousValue = usePrevious(props.inputValue);
    const [units, setUnits] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const bindClearSelection = useCallback((clear) => {
        clearSelection.current = clear;
    }, []);

    // Use effect to clear selection if the input value got 'reset' from outside
    useEffect(() => {
        if (previousValue && !props.inputValue) {
            clearSelection.current && clearSelection.current();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.inputValue, bindClearSelection]);

    useEffect(() => {
        API.fetchAvailableUnits().then((units) => {
            if (units.length) setUnits(units);
            setIsReady(true);
        });
    }, []);

    const classes = useStyles();
    return (
        <div>
            <Downshift
                id="downshift-options"
                itemToString={(item) => (item ? item.unit_number : '')}
                onChange={props.update}
                inputValue={props.value}
            >
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
                    bindClearSelection(clearSelection);

                    const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
                        onChange: (event) => {
                            if (event.target.value === '') {
                                clearSelection();
                            }
                        },
                        onFocus: openMenu,
                    });
                    let suggestions = getSuggestions(units, inputValue, { showEmpty: true }).map((suggestion, index) =>
                        renderSuggestion({
                            suggestion,
                            inputValue,
                            index,
                            itemProps: getItemProps({ item: suggestion }),
                            highlightedIndex,
                            selectedItem,
                        })
                    );
                    if (!isReady) {
                        suggestions = [<MenuItem key="not-ready">Loading...</MenuItem>];
                    } else if (suggestions.length === 0) {
                        suggestions = [<MenuItem key="no-results">No results found</MenuItem>];
                    }

                    return (
                        <div className={classes.container}>
                            {renderInput({
                                fullWidth: true,
                                classes,
                                label: 'Select Unit',
                                InputLabelProps: getLabelProps({ shrink: true }),
                                InputProps: { onBlur, onChange, onFocus },
                                inputProps,
                                error: props.error,
                                helperText: props.helperText,
                                disabled: props.disabled,
                            })}

                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className={classes.paper} square>
                                        {suggestions}
                                    </Paper>
                                ) : null}
                            </div>
                        </div>
                    );
                }}
            </Downshift>
        </div>
    );
}

AvailableUnitsSelector.propTypes = {
    update: PropTypes.func,
    error: PropTypes.bool,
    helperText: PropTypes.bool,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // TODO: Fix this to keep one
    disabled: PropTypes.bool,
    value: PropTypes.any,
};
