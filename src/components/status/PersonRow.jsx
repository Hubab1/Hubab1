import React from 'react';

import { ROLE_PRIMARY_APPLICANT } from 'app/constants';
import {LinkButton, P } from 'assets/styles';
import { CardRow } from './styles';


export const PersonRow = ({person, label, role, handleClick}) => {
    const isPrimaryApplicant = role === ROLE_PRIMARY_APPLICANT;
    const showLink = isPrimaryApplicant && !person.is_registered && label !== 'Main Applicant';

    return <CardRow key={person.id}>
        <div>
            <P>{`${person.first_name} ${person.last_name}`}</P>
            <P fontSize={14} color="#828796" margin="5px 0 0 0">{label}</P>
        </div>
        <div>
            {/* Applicant Status to be added here */}
            { showLink && 
                <LinkButton 
                    role="button" 
                    onClick={() => handleClick(person)} 
                >
                    Resend Invite
                </LinkButton> 
            }                        
        </div>
    </CardRow>
}