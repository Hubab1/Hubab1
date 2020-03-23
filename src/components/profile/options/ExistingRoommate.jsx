import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { P } from 'assets/styles';
import { link, applicationStatus, inviteeContact, nameContainer, rightAlign } from './styles';
import { APPLICANT_STATUS_COLOR_MAP, ROUTES, MILESTONE_APPLICANT_SUBMITTED, CO_APPLICANT_STATUS_NOT_STARTED,
    CO_APPLICANT_STATUS_COMPLETED, CO_APPLICANT_STATUS_IN_PROGRESS } from 'app/constants';


export default function ExistingRoommate({item, type}) {
    const getRoommateStatus = (item) => {
        if (item.last_milestone && item.last_milestone.event) {
            if(item.last_milestone.event === MILESTONE_APPLICANT_SUBMITTED) {
                return CO_APPLICANT_STATUS_COMPLETED;
            } else {
                return CO_APPLICANT_STATUS_IN_PROGRESS
            }
        } else {
            return CO_APPLICANT_STATUS_NOT_STARTED
        }
    };
    const statusColor = APPLICANT_STATUS_COLOR_MAP[getRoommateStatus(item)];

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
        <div className={rightAlign}>
            <span className={applicationStatus}>Application Status:</span>
            <br/>
            <P bold color={statusColor}>{getRoommateStatus(item)}</P>
        </div>
    </Fragment>
}

ExistingRoommate.propTypes = { 
    item: PropTypes.object,
    type: PropTypes.string,
};
