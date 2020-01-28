import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { P } from 'assets/styles';
import { link, applicationStatus, inviteeContact, nameContainer } from './styles';
import { APPLICANT_STATUS_COLOR_MAP, ROUTES } from 'app/constants';


export default function ExistingRoommate({item, type}) {
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
                <Link 
                    className={link}
                    to={{
                        pathname: ROUTES.RESEND_INVITE,
                        state: {
                            initialValues: item,
                            confirmationButtonText: "Back to Rental Profile",
                            returnRoute: `${ROUTES.PROFILE_OPTIONS}#${type}`
                        }
                    }}
                >
                    Edit/Resend
                </Link>
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
    type: PropTypes.string,
};
