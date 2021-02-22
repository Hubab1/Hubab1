import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'use-http';
import { API_URL } from 'config';
import Auth from 'utils/auth';

export function HttpProvider({ children }) {
    const options = {
        headers: {
            Authorization: `Authorization ${Auth.getToken()}`,
        },
    };

    return (
        <Provider url={API_URL} options={options}>
            {children}
        </Provider>
    );
}

HttpProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HttpProvider;
