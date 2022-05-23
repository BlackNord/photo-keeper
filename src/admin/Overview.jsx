import React from 'react';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Administrator's settings</h1>
            <p>This management can be used only by administrators.</p>
            <p><a class="btn btn-dark" href={`${path}/users`} role="button">User management</a></p>
        </div>
    );
}

export { Overview };
