import React from 'react';
import PropTypes from 'prop-types';
import { generatePath, Link } from 'react-router-dom';

import { APPLICANT_STATUS_COLOR_MAP, ROLE_PRIMARY_APPLICANT, ROUTES } from 'constants/constants';
import { getRoommateStatus } from 'utils/misc';
import { applicationStatus, link, P, CardRow } from 'assets/styles';
import { connect } from 'react-redux';

export const PersonRow = ({ application, person, label, role }) => {
    const isPrimaryApplicant = role === ROLE_PRIMARY_APPLICANT;
    const showResendLink =
        isPrimaryApplicant && !person.is_registered && label !== 'Main Applicant' && label !== 'Occupant';

    const statusColor = APPLICANT_STATUS_COLOR_MAP[getRoommateStatus(person)];

    return (
        <CardRow key={person.id}>
            <div>
                <P>{`${person.first_name} ${person.last_name}`}</P>
                <P fontSize={14} color="#828796" margin="5px 0 0 0">
                    {label}
                </P>
            </div>
            <div className="text-right">
                <div>
                    <span className={applicationStatus}>Application Status:</span>
                    <br />
                    <P bold color={statusColor}>
                        {getRoommateStatus(person)}
                    </P>
                </div>
                {showResendLink && (
                    <Link
                        className={link}
                        to={{
                            pathname: generatePath(ROUTES.RESEND_INVITE, { application_id: application.id }),
                            state: {
                                initialValues: person,
                                confirmationButtonText: 'Back to Application Status',
                                returnRoute: ROUTES.APP_COMPLETE,
                            },
                        }}
                    >
                        Edit/Resend
                    </Link>
                )}
            </div>
        </CardRow>
    );
};

PersonRow.propTypes = {
    person: PropTypes.object,
    label: PropTypes.string,
    role: PropTypes.string,
    application: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    application: state.renterProfile,
});

export default connect(mapStateToProps, null)(PersonRow);
