export const CHUCK_BASE_URL = process.env.REACT_APP_CHUCK_DOMAIN;
const API_URL = `${CHUCK_BASE_URL}/api/onlineleasing`;

const defaultHeaders = {
    accept: 'application/json',
    'content-type': 'application/json',
};

export function setTokenHeader(value) {
    defaultHeaders['Authorization'] = `Token ${value}`;
}

export function clearTokenHeader() {
    delete defaultHeaders['Authorization'];
}

export function getTokenHeader() {
    return defaultHeaders['Authorization'];
}

export default function request(path, args = {}) {
    const url = `${API_URL}/${path}`;

    const options = {
        headers: defaultHeaders,
        method: args.method || 'GET',
    };

    if (args.data) {
        options.body = JSON.stringify(args.data);
        options.headers['content-type'] = 'application/json';
    }

  // eslint-disable-next-line no-console
    console.log({
        headers: options.headers
    });

    return fetch(url, options).then((res) => {
        if (res.status === 204) {
            return res;
        }

        if (res.status >= 200 && res.status < 300) {
            return res.json().then((body) => [body, res]);
        }

        // Usage of .text() and JSON.parse(..) to get any response data
        return res.text().then((text) => {
            const error = new Error(res.statusText);

            try {
                error.responseBody = JSON.parse(text);
            } catch (_ignore) {
                // Most probably the response doesnt contain any json, just ignore
            }

            error.res = res;
            throw error;
        });
    });
}
