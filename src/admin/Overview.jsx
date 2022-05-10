import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Administrator's settings</h1>
            <p>This section can be used only by administrators.</p>
            <p><Link to={`${path}/users`}>User management</Link></p>
        </div>
    );
}

export { Overview };
