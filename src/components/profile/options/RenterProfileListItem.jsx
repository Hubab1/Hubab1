import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Info from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import pluralize from 'pluralize';

import { infoIconRoot, P } from 'assets/styles';
import SimplePopover from 'components/common/SimplePopover';


import { applicationStatus, buttonRoot, contentContainer, existingItemRow, label, prefix, paperRoot, renterProfileListItemContainer } from './styles';

function ExistingRoommate({item}) {
    const statusColor = !!item.status ? '#DB5963' : '#FAC700';
    return <div className={existingItemRow}>
        <div>{`${item.first_name} ${item.last_name}`}</div>
        <div>
            <span className={applicationStatus}>Application Status:</span>
            <br/>
            <P color={statusColor}>{!!item.status ? item.status : 'Not Started'}</P>
        </div>
    </div>
}

function ExistingItems({existingItems, nameLabel}) {
    const [showItems, setShowItems] = useState(false);
    const toggleLabel = `${existingItems.length} ${pluralize(nameLabel, existingItems.length)}`;
    const toggleIcon = !!showItems ? <ExpandLessIcon/> : <ExpandMoreIcon/>
    const existingItemComponentMap = {
        'Roommates': ExistingRoommate,
    }
    const ExistingItemComponent = existingItemComponentMap[nameLabel];
    return (
        <div className="existingItemsContainer">
            <div onClick={() => setShowItems(!showItems)} className={existingItemRow}>{toggleLabel}&nbsp;Added&nbsp;{toggleIcon}</div>
            {showItems && existingItems.map(item => <ExistingItemComponent item={item} key={item.id}/>)}
        </div>
    )
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