import React from 'react';

import { accountService } from '@/_services';

function Home() {
    const user = accountService.userValue;

    return (
        <div className="p-4">
            <div className="container">
                <h1>Welcome, dear {user.name} {user.surname}</h1><p />
                <p>You've logged in Photo Keeper!</p>
                <p>Thanks for choosing us! This web-service is created for secure storage and image colorization in your personal account.</p>
                <p className="fig"><img src={"../public/img/big_logo.png"} /></p>
            </div>
            <footer className="border-top footer text-muted">
                <div className="text-center mt-4">
                    &copy; 2022 - PhotoKeeper
                </div>
            </footer>
        </div>
    );
}

export { Home };
