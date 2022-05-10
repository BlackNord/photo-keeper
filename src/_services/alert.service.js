import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

const alertSubject = new Subject();
const defaultId = 'default-alert';

export const alertService = {
    onAlert,
    success,
    error,
    information,
    warning,
    alert,
    clear
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Information: 'Information',
    Warning: 'Warning'
}

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
    return alertSubject.asObservable().pipe(filter(x => x && x.id === id));
}

function success(message, options) {
    alert({ ...options, type: AlertType.Success, message });
}

function error(message, options) {
    alert({ ...options, type: AlertType.Error, message });
}

function information(message, options) {
    alert({ ...options, type: AlertType.Information, message });
}

function warning(message, options) {
    alert({ ...options, type: AlertType.Warning, message });
}

// core
function alert(alert) {
    alert.id = alert.id || defaultId;
    alert.autoClose = (alert.autoClose === undefined ? true : alert.autoClose);
    alertSubject.next(alert);
}

function clear(id = defaultId) {
    alertSubject.next({ id });
}
