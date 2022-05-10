import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { accountService } from '@/_services';

function PrivateRoute({ component: Component, roles, ...rest }) {
    return (
        <Route {...rest} render={props => {
            const user = accountService.userValue;
            if (!user) {
                // redirecting to login page with the return url (not login)
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />
            }

            // route is restricted by role
            if (roles && roles.indexOf(user.role) === -1) {
                // redirecting to home page (not authorized)
                return <Redirect to={{ pathname: '/' }} />
            }

            // authorized
            return <Component {...props} />
        }} />
    );
}

export { PrivateRoute };
