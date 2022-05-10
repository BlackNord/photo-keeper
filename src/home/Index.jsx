import React from 'react';

import { accountService } from '@/_services';

function Home() {
    const user = accountService.userValue;

    return (
        <div className="p-4">
            <div className="container">
                <h1>Welcome, dear {user.name} {user.surname}</h1>
                <p>You've logged in Photo Keeper</p>
            </div>
        </div>
    );
}

export { Home };
