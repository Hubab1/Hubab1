import React, { useState } from 'react';
import API from 'app/api';
import { LinkButton } from 'assets/styles';
import { css } from 'emotion';

export const aanLink = css`
    outline: none;
`;

export const openNewWindow = () => {
    return window.open('data:text/plain;charset=utf-8;base64,TG9hZGluZw==', '_blank');
};

export const AdverseActionNoticeButton = () => {
    const [error, setError] = useState(false);

    const openDocument = async () => {
        const w = openNewWindow();
        try {
            const response = await API.fetchAANDocument();
            const blobUrl = URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            w.location.replace(blobUrl);
        } catch (e) {
            setError(true);
        }
    };

    const getText = () => {
        if (error) {
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
