import config from 'config';

import { fetchWrapper } from '@/_helpers';

const baseUrl = `${config.apiUrl}/Colorization`;

export const colorizationService = {
    colorize
};

function colorize(id) {
    return fetchWrapper.postColorization(`${baseUrl}/${id}`);
}
