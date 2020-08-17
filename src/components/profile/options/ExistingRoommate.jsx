import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router';
import { P, Span } from 'assets/styles';
import { link, inviteeContact, nameContainer } from './styles';
import { applicationStatus, Spacer } from 'assets/styles';
import { APPLICANT_STATUS_COLOR_MAP, ROUTES } from 'app/constants';
import { getRoommateStatus } from 'utils/misc';

const linkStyle = {
    textDecoration: 'underline',
    fontSize: 14
};

export default function ExistingRoommate({item, type, isDependent}) {
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
            </div>
            }
            {

                isDependent && (
                    <>
                        <Span className="color-manatee" fontSize={14}>
                            Under 18
                        </Span>
                        <Spacer height={10}/>
                        <Link
                            style={linkStyle}
                            to={generatePath(ROUTES.EDIT_DEPENDANT, { id: item.id })}
                        >Edit
                        </Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Link
                            style={linkStyle}
                            to={null}>Remove
                        </Link>
                    </>
                )
            }
        </div>
        {
            !isDependent &&
            <div className="text-right">
                <span className={applicationStatus}>Application Status:</span>
                <br/>
                <P bold color={statusColor}>{getRoommateStatus(item)}</P>
            </div>
        }
    </Fragment>
}

ExistingRoommate.propTypes = { 
    item: PropTypes.object,
    type: PropTypes.string,
    isDependent: PropTypes.bool,
};
