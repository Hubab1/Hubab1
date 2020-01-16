import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';
import pluralize from 'pluralize';

import { P } from 'assets/styles';
import { applicationStatus, existingItemsContainer, existingItemRow  } from './styles';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        padding: 0
    },
}));

function ExistingItems({children, existingItemsLabel}) {
    const classes = useStyles();
    const toggleLabel = `${children.length} ${pluralize(existingItemsLabel, children.length)}`;
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

ExistingItems.propTypes = {
    children: PropTypes.array,
    existingItemsLabel: PropTypes.string,
};

export function ExistingRoommate({item}) {
    const statusColor = !!item.status ? '#FAC700' : '#DB5963';
    return <Fragment>
        <div>{`${item.first_name} ${item.last_name}`}</div>
        <div>
            <span className={applicationStatus}>Application Status:</span>
            <br/>
            <P color={statusColor}>{!!item.status ? item.status : 'Not Started'}</P>
        </div>
    </Fragment>
}

ExistingRoommate.propTypes = { item: PropTypes.object };


export default ExistingItems;