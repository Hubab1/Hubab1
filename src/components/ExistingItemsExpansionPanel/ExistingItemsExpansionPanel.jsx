import React from 'react';
import PropTypes from 'prop-types';

import pluralize from 'pluralize';
import {
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

import { existingItemsContainer, existingItemRow } from './styles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        padding: 0
    },
}));

function ExistingItemsExpansionPanel({children, defaultExpanded, label, labelQuantity}) {
    const classes = useStyles();
    labelQuantity = labelQuantity ?? 0;
    if (!labelQuantity) return null;
    const toggleLabel = `${labelQuantity} ${pluralize(label, labelQuantity)}`;
    return (
        <div className={existingItemsContainer}>
            <ExpansionPanel elevation={0} defaultExpanded={defaultExpanded}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    {toggleLabel}&nbsp;Added
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{root:classes.root}}>
                    {React.Children.map(children, child => (
                        <div className={existingItemRow}>{child}</div>
                    ))}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

ExistingItemsExpansionPanel.propTypes = {
    children: PropTypes.array,
    label: PropTypes.string,
    labelQuantity: PropTypes.number,
    defaultExpanded: PropTypes.bool,
};

export default ExistingItemsExpansionPanel;
