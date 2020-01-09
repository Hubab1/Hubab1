import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/styles';

import MultiSelectContext from './context';
import { contentContainer, label, prefix, buttonRoot, unselected, multiSelectChoiceContainer } from './styles';
import  { hexToRGB } from 'utils/misc';

const useStyles = makeStyles((theme) => createStyles({
    selected: {
        boxShadow: `0px 2px 4px 0px ${hexToRGB(theme.palette.primary.main, 0.5)} !important`
    },
}));

function MultiSelectChoice (props) {
    
    const context = useContext(MultiSelectContext);
    const classes = useStyles();
    return (
        <div className={multiSelectChoiceContainer}>
            <Paper
                onClick={()=>context._onClick(props.name)}
                fullWidth
                classes={{
                    // root: props._selected ? selected + ' ' + classes.selected : unselected,
                    root: unselected,
                    // label: contentContainer
                }}
            >
                <div>
                    <div className={contentContainer}>
                        <div className={prefix}>{props.prefix}</div>
                        <div className={label}>{props.label}</div>
                    </div>
                    <Button
                        onClick={()=>context._onClick(props.name)}
                        variant="outlined"
                        color="primary"
                        fullWidth
                        classes={{
                            root: buttonRoot
                            // label: contentContainer

                        }}
                    >Invite a roommate</Button>
                </div>
            </Paper>
        </div>
    );
}

MultiSelectChoice.propTypes = {
    _selected: PropTypes.bool,
    prefix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    label: PropTypes.string
}

export default MultiSelectChoice;