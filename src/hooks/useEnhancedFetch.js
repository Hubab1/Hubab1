import { useEffect } from 'react';
import useFetch from 'use-http';

/**
 * A response can fail with or withour any error data. Even when there is data, is can be in different formats.
 * This function will try and get the error parsed in the correct format (either in JSON or plain text).
 *
 * When a response does not have any error data, the response error gets returned
 * default format: { name: Int, message: String },
 * e.g. { name: 500, message: 'Internal Server Error' }
 */
const getEnhancedError = (fetch) => {
    let error;

    if (!fetch.response.ok) {
        try {
            error = JSON.parse(fetch.response.data);
        } catch {
            // data is plain text, us it as errors
            error = fetch.response.data;
        }

        if (!error) {
            error = fetch.error;
        }
    }

    return error;
};

/**
 * An enhanced hook for using useFetch.
 *
 * Enhancements:
 *  - Ability to fetch data right away or on demand
 *  - Abstracting response error
 *
 * @param url (String): the api endpoint
 * @param fetchOnDemand (Boolean): determines wether or not to fetch data right away or on demand (GET requests only)
 * @param method (String): GET, POST, PUT or DELETE
 * @param options (Object): see https://use-http.com/#/?id=destructured
 */
const useEnhancedFetch = (url, { method = undefined, fetchOnDemand = true, ...options }) => {
    if (!method) {
        throw new Error('method is required (GET, POST, PUT, DELETE)');
    }

    const fetch = useFetch(url, options);

    useEffect(() => {
        if (method === 'GET' && !fetchOnDemand) {
            fetch.get();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const error = getEnhancedError(fetch);

    return {
        ...fetch,
        error,
    };
};

export default useEnhancedFetch;
