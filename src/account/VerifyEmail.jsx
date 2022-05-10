import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';

import { accountService, alertService } from '@/_services';

function VerifyEmail({ history }) {
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed'
    }

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
        const { token } = queryString.parse(location.search);

        // token was removed from url to prevent http-referer leakage
        history.replace(location.pathname);

        accountService.verifyEmail(token)
            .then(() => {
                alertService.success('Verification step is successful, you can login in your account now.', { keepAfterRouteChange: true });
                history.push('login');
            })
            .catch(() => {
                setEmailStatus(EmailStatus.Failed);
            });
    }, []);

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <div>Verifying...</div>;
            case EmailStatus.Failed:
                return <div>Verification step is failed, you can verify your account using the <Link to="repeat-verifying">repeat verifying</Link> page.</div>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Verifying email</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { VerifyEmail }; 
