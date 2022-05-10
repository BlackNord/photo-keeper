import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div>
            <h1>Your profile</h1>
            <p>
                <strong>Name: </strong> {user.name} <br />
                <strong>Surname: </strong> {user.surname}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><Link to={`${path}/update`}>Update your profile</Link></p>
        </div>
    );
}

export { Details };
