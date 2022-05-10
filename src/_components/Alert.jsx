import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { alertService, AlertType } from '@/_services';
import { history } from '@/_helpers';

const propTypes = {
    id: PropTypes.string,
    isFade: PropTypes.bool
};

const defaultProps = {
    id: 'default-alert',
    isFade: true
};

function Alert({ id, isFade }) {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscribing to new alert notification
        const subscription = alertService.onAlert(id)
            .subscribe(alert => {
                // clearing alerts when an empty alert is received
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filtering out alerts without 'keepAfterRouteChange' flag
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // removing 'keepAfterRouteChange' flag
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);

                        return filteredAlerts;
                    });
                }
                else {
                    // adding alert to array
                    setAlerts(alerts => ([...alerts, alert]));

                    // auto closing alert if required
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });

        // clearing alerts on location changing
        const historyUnlisten = history.listen(({ pathname }) => {
            // don't clearing while trailing slash (will be auto redirected again)
            if (pathname.endsWith('/'))
                return;

            alertService.clear(id);
        });

        // cleaning up (during the component unmounting)
        return () => {
            // unsubscribe & unlisten to avoid memory leaks
            subscription.unsubscribe();
            historyUnlisten();
        };
    }, []);

    function removeAlert(alert) {
        if (isFade) {
            // fading out alert
            const alertWithFade = { ...alert, isFade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // removing alert after faded out
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        }
        else {
            // removing alert
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    }

    function cssClasses(alert) {
        if (!alert)
            return;

        const classes = ['alert', 'alert-dismissable'];

        const alertTypeClass = {
            [AlertType.Success]: 'alert alert-success',
            [AlertType.Error]: 'alert alert-danger',
            [AlertType.Information]: 'alert alert-info',
            [AlertType.Warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.isFade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alerts.length)
        return null;

    return (
        <div className="container">
            <div className="m-3">
                {alerts.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <a className="close" onClick={() => removeAlert(alert)}>&times;</a>
                        <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                    </div>
                )}
            </div>
        </div>
    );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;

export { Alert };
