import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router';
import { css } from 'emotion';
import clsx from 'clsx';

import {
    APPLICANT_STATUS_COLOR_MAP,
    CO_APPLICANT_STATUS_NOT_STARTED,
    ROUTES,
    RENTER_PROFILE_TYPE_DEPENDENT,
    RENTER_PROFILE_TYPE_OCCUPANT,
} from 'constants/constants';
import { getRoommateStatus } from 'utils/misc';
import { P, Span, applicationStatus, Spacer } from 'assets/styles';
import { link, inviteeContact, nameContainer } from './ExistingRoommateStyles';
import { applicationPath, selectors } from 'reducers/renter-profile';
import { connect } from 'react-redux';

const removeLink = css`
    margin-left: 15px;
`;

export function ExistingRoommate({ item, type, application }) {
    const isOccupant = type === RENTER_PROFILE_TYPE_OCCUPANT;
    const isDependent = type === RENTER_PROFILE_TYPE_DEPENDENT;
    const statusColor = APPLICANT_STATUS_COLOR_MAP[getRoommateStatus(item)];
    const didPersonStartApplication = getRoommateStatus(item) !== CO_APPLICANT_STATUS_NOT_STARTED;
    const application_id = application.id;
    return (
        <>
            <div className={nameContainer}>
                <div>
                    {`${item.first_name} ${item.last_name}`}
                    <br />
                    {!item.is_registered && !isDependent && !isOccupant && (
                        <span className={inviteeContact}>{item.email || item.phone_number}</span>
                    )}
                </div>
                {!item.is_registered && !isDependent && !isOccupant && (
                    <>
                        <br />
                        <Link
                            className={link}
                            to={{
                                pathname: applicationPath(ROUTES.RESEND_INVITE, application.id),
                                state: {
                                    initialValues: item,
                                    confirmationButtonText: 'Back to Rental Profile',
                                    returnRoute: `${applicationPath(ROUTES.PROFILE_OPTIONS, application.id)}#${type}`,
                                },
                            }}
                        >
                            Edit/Resend
                        </Link>
                    </>
                )}
                {!isDependent && !isOccupant && !didPersonStartApplication && (
                    <Link
                        className={clsx([link, removeLink])}
                        to={generatePath(ROUTES.REMOVE_PERSON, { id: item.id, type, application_id })}
                    >
                        Remove
                    </Link>
                )}
                {isOccupant && (
                    <Span className="color-manatee" fontSize={14}>
                        Occupant
                    </Span>
                )}
                {isDependent && (
                    <>
                        <Span className="color-manatee" fontSize={14}>
                            Under 18
                        </Span>
                        <Spacer height={10} />
                        <Link
                            className={link}
                            to={generatePath(ROUTES.EDIT_DEPENDANT, { id: item.id, application_id })}
                        >
                            Edit
                        </Link>
                        <Link
                            className={clsx([link, removeLink])}
                            to={generatePath(ROUTES.REMOVE_PERSON, { id: item.id, type, application_id })}
                        >
                            Remove
                        </Link>
                    </>
                )}
            </div>
            {!isDependent && (
                <div className="text-right">
                    <span className={applicationStatus}>Application Status:</span>
                    <br />
                    <P bold color={statusColor}>
                        {getRoommateStatus(item)}
                    </P>
                </div>
            )}
        </>
    );
}

ExistingRoommate.propTypes = {
    item: PropTypes.object,
    type: PropTypes.string,
    isDependent: PropTypes.bool,
    application: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    application: state.renterProfile,
});

export default connect(mapStateToProps)(ExistingRoommate);
