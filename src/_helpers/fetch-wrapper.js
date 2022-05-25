import config from 'config';

import { accountService } from '@/_services';

export const fetchWrapper = {
    get,
    post,
    put,
    postPhoto,
    putPhoto,
    postColorization,
    delete: _delete
}

function get(url) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(url)
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function postPhoto(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(url),
        credentials: 'include',
        body: body
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function postColorization(url) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include'
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function putPhoto(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(url),
        body: body
    };

    return fetch(url, requestOptions).then(handleResponse);
}

// 'delete' is a reserved word in js
function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };

    return fetch(url, requestOptions).then(handleResponse);
}

// helpering

export function authHeader(url) {
    // return auth header with jwt if user is logged in and request is API url
    const user = accountService.userValue;
    const isLoggedIn = user && user.jwtToken;
    const isApiUrl = url.startsWith(config.apiUrl);

    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.jwtToken}` };
    }
    else {
        return {};
    }
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if ([401, 403].includes(response.status) && accountService.userValue) {
                // '401 Unauthorized' or '403 Forbidden' responses returned from API
                accountService.logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
