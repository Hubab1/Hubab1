import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router';
import { P, Span } from 'assets/styles';
import { css } from 'emotion';
import clsx from 'clsx';
import { link, inviteeContact, nameContainer } from './styles';
import { applicationStatus, Spacer } from 'assets/styles';
import {
    APPLICANT_STATUS_COLOR_MAP,
    CO_APPLICANT_STATUS_NOT_STARTED,
    ROUTES,
    RENTER_PROFILE_TYPE_DEPENDENT,
    RENTER_PROFILE_TYPE_OCCUPANT,
} from 'app/constants';
import { getRoommateStatus } from 'utils/misc';

const removeLink = css`
    margin-left: 15px;
`;

export default function ExistingRoommate({ item, type }) {
    const isOccupant = type === RENTER_PROFILE_TYPE_OCCUPANT;
    const isDependent = type === RENTER_PROFILE_TYPE_DEPENDENT;
    const statusColor = APPLICANT_STATUS_COLOR_MAP[getRoommateStatus(item)];
    const didPersonStartApplication = getRoommateStatus(item) !== CO_APPLICANT_STATUS_NOT_STARTED;

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
                                pathname: ROUTES.RESEND_INVITE,
                                state: {
                                    initialValues: item,
                                    confirmationButtonText: 'Back to Rental Profile',
                                    returnRoute: `${ROUTES.PROFILE_OPTIONS}#${type}`,
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
                        to={generatePath(ROUTES.REMOVE_PERSON, { id: item.id, type })}
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
                        <Link className={link} to={generatePath(ROUTES.EDIT_DEPENDANT, { id: item.id })}>
                            Edit
                        </Link>
                        <Link
                            className={clsx([link, removeLink])}
                            to={generatePath(ROUTES.REMOVE_PERSON, { id: item.id, type })}
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
};
