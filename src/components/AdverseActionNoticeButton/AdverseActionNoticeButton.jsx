import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

import API from 'api/api';
import ActionButton from 'components/ActionButton/ActionButton';
import { LinkButton } from 'assets/styles';

export const aanLink = css`
    outline: none;
`;

export const LINK_BUTTON = 'link';
export const ACTION_BUTTON = 'button';

export function AdverseActionNoticeButton({ componentType, ...props }) {
    const [error, setError] = useState(false);

    const openDocument = async () => {
        const w = window.open('', '_blank');
        w.document.write('Loading');
        try {
            const response = await API.fetchAANDocument();
            const blobUrl = URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            w.location.replace(blobUrl);
        } catch (e) {
            setError(true);
        }
    };

    const Component = componentType === LINK_BUTTON ? LinkButton : ActionButton;

    return (
        <>
            <Component onClick={openDocument} className={aanLink} {...props}>
                Learn why
            </Component>
            {error && <p>An error occurred. Please try again.</p>}
        </>
    );
}

AdverseActionNoticeButton.propTypes = {
    componentType: PropTypes.oneOf([LINK_BUTTON, ACTION_BUTTON]).isRequired,
};
