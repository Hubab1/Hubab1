import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { makeStyles } from '@material-ui/core/styles';

import pluralize from 'pluralize';

import { infoIconRoot, P } from 'assets/styles';
import SimplePopover from 'components/common/SimplePopover';


import { applicationStatus, buttonRoot, contentContainer, existingItemsContainer, existingItemRow, label, prefix, paperRoot, renterProfileListItemContainer } from './styles';

function ExistingRoommates({items}) {
    return items.map(item => {
        const statusColor = !!item.status ? '#DB5963' : '#FAC700';
        return <div key={item.id} className={existingItemRow}>
            <div>{`${item.first_name} ${item.last_name}`}</div>
            <div>
                <span className={applicationStatus}>Application Status:</span>
                <br/>
                <P color={statusColor}>{!!item.status ? item.status : 'Not Started'}</P>
            </div>
        </div>
    });
}

ExistingRoommates.propTypes = { items: PropTypes.array }

const useStyles = makeStyles(theme => ({
    root: {
        display: 'block',
        padding: 0
    },
}));

function ExistingItems({existingItems, nameLabel}) {
    const classes = useStyles();
    const toggleLabel = `${existingItems.length} ${pluralize(nameLabel, existingItems.length)}`;
    const existingItemComponentMap = {
        'Roommates': ExistingRoommates,
    }
    const ExistingItemsComponent = existingItemComponentMap[nameLabel];
    return (
        <div className={existingItemsContainer}>
            <ExpansionPanel elevation={0}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    {toggleLabel}&nbsp;Added
                </ExpansionPanelSummary>
                <ExpansionPanelDetails classes={{root:classes.root}}>
                    <ExistingItemsComponent items={existingItems}/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
}

ExistingItems.propTypes = {
    existingItems: PropTypes.array,
    nameLabel: PropTypes.string,
}



function RenterProfileListItem (props) {
    return (
        <div className={renterProfileListItemContainer}>
            <div className={paperRoot}>
                <div className={contentContainer}>
                    <div className={prefix}>{props.prefix}</div>
                    <div className={label}>{props.label}&nbsp;
                        {props.tip && <SimplePopover text={props.tip}>
                            <Info classes={{root: infoIconRoot}} style={{color:'#828796',width:16}}/>
                        </SimplePopover>}
                    </div>
                </div>
                {!!props.existingItems && <ExistingItems nameLabel={props.nameLabel} existingItems={props.existingItems}/>}
                <Link to={props.route}>
                    <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        classes={{
                            root: buttonRoot

                        }}
                    >{props.buttonLabel}</Button>
                </Link>
            </div>
        </div>
    );
}

RenterProfileListItem.propTypes = {
    prefix: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    label: PropTypes.string,
    buttonLabel: PropTypes.string,
    route: PropTypes.string,
}

export default RenterProfileListItem;