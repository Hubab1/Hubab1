import React from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';


import { contentContainer, label, prefix, buttonRoot, paperRoot, renterProfileListItemContainer } from './styles';

function RenterProfileListItem (props) {
    return (
        <div className={renterProfileListItemContainer}>
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
                    >{props.buttonLabel}</Button>
                </div>
            </Paper>
        </div>
    );
}

RenterProfileListItem.propTypes = {
    prefix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    label: PropTypes.string,
    buttonLabel: PropTypes.string,
}

export default RenterProfileListItem;