import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import ResendLinkForm from 'components/common//ResendLinkForm';

import { P } from 'assets/styles';
import { applicationStatus, resendLink } from './styles';


export default function ExistingRoommate({item}) {
    const [resendFormValues, setResendFormValues] = useState();

    if (resendFormValues) {
        return <ResendLinkForm 
            initialValues={resendFormValues} 
            handleConfirmationClick={setResendFormValues}
        />
    }

    const statusColor = !!item.status ? '#FAC700' : '#DB5963';
    return <Fragment>
        <div>
            <div>{`${item.first_name} ${item.last_name}`}</div>
            {!item.is_registered && <div>
                <span className={resendLink} onClick={() => setResendFormValues(item)}>
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

ExistingRoommate.propTypes = { item: PropTypes.object };
