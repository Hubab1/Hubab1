import React from 'react';
import { Link } from 'react-router-dom';

import { ROLE_PRIMARY_APPLICANT, ROUTES } from 'app/constants';
import {link, P, CardRow } from 'assets/styles';


export const PersonRow = ({person, label, role}) => {
    const isPrimaryApplicant = role === ROLE_PRIMARY_APPLICANT;
    const showResendLink = isPrimaryApplicant && !person.is_registered && label !== 'Main Applicant';

    return <CardRow key={person.id}>
        <div>
            <P>{`${person.first_name} ${person.last_name}`}</P>
            <P fontSize={14} color="#828796" margin="5px 0 0 0">{label}</P>
        </div>
        <div>
            {/* Applicant Status to be added here */}
            { showResendLink && 
                <Link 
                    className={link}
                    to={{
                        pathname: ROUTES.RESEND_INVITE,
                        state: {
                            initialValues: person,
                            confirmationButtonText: "Back to Application Status",
                            returnRoute: ROUTES.APP_COMPLETE
                        }
                    }}
                >
                    Edit/Resend
                </Link>
            }                        
        </div>
    </CardRow>
}