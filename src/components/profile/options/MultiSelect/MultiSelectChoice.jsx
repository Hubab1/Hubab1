import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/styles';

import MultiSelectContext from './context';
import { contentContainer, label, prefix, selected, unselected, multiSelectChoiceContainer } from './styles';
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
            <Button
                onClick={()=>context._onClick(props.name)}
                variant="outlined"
                color="primary"
                fullWidth
                classes={{
                    root: props._selected ? selected + ' ' + classes.selected : unselected,
                    label: contentContainer
                }}
            >
                <div className={prefix}>{props.prefix}</div>
                <div className={label}>{props.label}</div>
            </Button>
        </div>
    );
}

MultiSelectChoice.propTypes = {
    _selected: PropTypes.bool,
    prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string
}

export default MultiSelectChoice;