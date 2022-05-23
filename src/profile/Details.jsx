import React from 'react';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div>
            <h1>Your profile information</h1>
            <p>
                <strong>Name: </strong> {user.name} <br />
                <strong>Surname: </strong> {user.surname}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><a class="btn btn-dark" href={`${path}/update`} role="button">Update your profile</a></p>
        </div>
    );
}

export { Details };
