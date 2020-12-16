import React, { useState } from 'react';
import API from 'app/api';
import { LinkButton } from 'assets/styles';
import { css } from 'emotion';

export const aanLink = css`
    outline: none;
`;

export const AdverseActionNoticeButton = () => {
    const [error, setError] = useState(false);

    const openDocument = async () => {
        const w = window.open('data:text/plain;charset=utf-8;base64,TG9hZGluZw==', '_blank');
        try {
            const response = await API.fetchAANDocument();
            const blobUrl = URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            w.location.replace(blobUrl);
            // console.log('no error');
        } catch (e) {
            // console.log('ERROR1');
            setError(true);
        }
    };

    const getText = () => {
        if (error) {
            // console.log('ERROR2');
            return 'An error occurred. Please try again.';
        }

        return 'Learn why';
    };

    return (
        <LinkButton onClick={openDocument} className={aanLink}>
            {getText()}
        </LinkButton>
    );
};
