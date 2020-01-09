import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles } from '@material-ui/styles';


import { contentContainer, label, prefix, buttonRoot, paperRoot, multiSelectChoiceContainer } from './styles';
import  { hexToRGB } from 'utils/misc';

const useStyles = makeStyles((theme) => createStyles({
    selected: {
        boxShadow: `0px 2px 4px 0px ${hexToRGB(theme.palette.primary.main, 0.5)} !important`
    },
}));

function MultiSelectChoice (props) {
    return (
        <div className={multiSelectChoiceContainer}>
            <Paper
                classes={{
                    root: paperRoot
                }}
            >
                <div>
                    <div className={contentContainer}>
                        <div className={prefix}>{props.prefix}</div>
                        <div className={label}>{props.label}</div>
                    </div>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        classes={{
                            root: buttonRoot

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