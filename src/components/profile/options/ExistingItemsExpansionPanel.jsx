import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import pluralize from 'pluralize';

import { existingItemsContainer, existingItemRow } from './styles';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        padding: 0
    },
}));

function ExistingItemsExpansionPanel({children, label, labelQuantity}) {
    const classes = useStyles();
    const toggleLabel = `${labelQuantity} ${pluralize(label, labelQuantity)}`;
    return (
        <div className={existingItemsContainer}>
            <ExpansionPanel elevation={0}>
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
    )
}

ExistingItemsExpansionPanel.propTypes = {
    children: PropTypes.array,
    label: PropTypes.string,
    labelQuantity: PropTypes.number,
};

export default ExistingItemsExpansionPanel;