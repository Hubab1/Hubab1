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
    const previousValue = usePrevious(props.value);
    const [units, setUnits] = useState([]);
    const [isReady, setIsReady] = useState(false);

    const bindClearSelection = useCallback((clear) => {
        clearSelection.current = clear;
    }, []);

    // Use effect to clear selection if the value got 'reset' from outside
    useEffect(() => {
        if (previousValue && !props.value) {
            clearSelection.current && clearSelection.current();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.value, bindClearSelection]);

    useEffect(() => {
        API.fetchAvailableUnits().then((units) => {
            if (units.length) {
                // The available units returned by our request might not contain the application's unit if this unit has been marked as below-market-rate.
                // This may happen when an applicant was invited with a personalized link for a unit that is actually below-market-rate.
                // In that case, we manually add it to the list of available units.
                const availableUnits = [...units];
                const applicationUnitIsInListOfUnits =
                    props.application?.unit &&
                    availableUnits.findIndex((u) => u.id === props.application.unit.id) === -1;

                if (props.application?.unit_available && applicationUnitIsInListOfUnits) {
                    availableUnits.push(props.application.unit);
                }

                setUnits(availableUnits);
            }
            setIsReady(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    return (
        <div>
            <Downshift
                id="downshift-options"
                itemToString={(item) => (item ? item.unit_number : '')}
                onChange={props.update}
                initialSelectedItem={props.value}
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
    application: PropTypes.object.isRequired,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // TODO: Fix this to keep one
    error: PropTypes.bool,
    helperText: PropTypes.bool,
    disabled: PropTypes.bool,
    update: PropTypes.func.isRequired,
};
