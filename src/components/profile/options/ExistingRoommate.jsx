import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { P } from 'assets/styles';
import { applicationStatus, inviteeContact, nameContainer, resendLink } from './styles';
import { APPLICANT_STATUS_COLOR_MAP } from 'app/constants';


export default function ExistingRoommate({item, setResendInviteValues}) {
    const statusColor = APPLICANT_STATUS_COLOR_MAP[item.status];
    return <Fragment>
        <div className={nameContainer}>
            <div>
                {`${item.first_name} ${item.last_name}`}
                <br/>
                {!item.is_registered && <span className={inviteeContact}>{item.email || item.phone_number}</span>}

            </div>
            {!item.is_registered && <div>
                <br/>
                <span className={resendLink} onClick={() => setResendInviteValues(item)}>
                    Edit/Resend
                </span>
            </div>}

        </div>
        <div>
            <span className={applicationStatus}>Application Status:</span>
            <br/>
            <P color={statusColor}>{!!item.status ? item.status : 'Not Started'}</P>
        </div>
    </Fragment>
}

ExistingRoommate.propTypes = { 
    item: PropTypes.object,
    setResendInviteValues: PropTypes.func,
};
