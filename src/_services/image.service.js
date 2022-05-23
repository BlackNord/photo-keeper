import config from 'config';

import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/Photo`;

export const imageService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.postPhoto(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.putPhoto(`${baseUrl}/${id}`, params);
}

// 'delete' is a reserved word in js
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
