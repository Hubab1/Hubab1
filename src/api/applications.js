import request from 'utils/request';

export function getApplications() {
    return request('applications/', {
        method: 'GET'
    }).then(([ body ]) => body);
}
