import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { P, Span } from 'assets/styles';
import { link, applicationStatus, inviteeContact, nameContainer, rightAlign } from './styles';
import { APPLICANT_STATUS_COLOR_MAP, ROUTES, MILESTONE_APPLICANT_SUBMITTED, CO_APPLICANT_STATUS_NOT_STARTED,
    CO_APPLICANT_STATUS_COMPLETED, CO_APPLICANT_STATUS_IN_PROGRESS } from 'app/constants';


export default function ExistingRoommate({item, type, isDependent}) {
    const getRoommateStatus = (item) => {
        if (!item.last_milestone) return CO_APPLICANT_STATUS_NOT_STARTED;
        switch (item.last_milestone.event) {
            case MILESTONE_APPLICANT_SUBMITTED:
                return CO_APPLICANT_STATUS_COMPLETED;
            case null:
            case undefined:
                return CO_APPLICANT_STATUS_NOT_STARTED;
            default:
                return CO_APPLICANT_STATUS_IN_PROGRESS;
        }
    };
    const statusColor = APPLICANT_STATUS_COLOR_MAP[getRoommateStatus(item)];

    return <Fragment>
        <div className={nameContainer}>
            <div>
                {`${item.first_name} ${item.last_name}`}
                <br/>
                {!item.is_registered && !isDependent && <span className={inviteeContact}>{item.email || item.phone_number}</span>}

            </div>
            {!item.is_registered && !isDependent && <div>
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
        {
        isDependent &&
        <Span className="color-manatee" fontSize={14}>
            Under 18
        </Span>
        }
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
