import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { applicationStatus } from './styles';


export default function ExistingRoommate({item}) {
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
