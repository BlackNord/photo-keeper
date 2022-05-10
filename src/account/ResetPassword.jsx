import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function ResetPassword({ history }) {
    const TokenStatus = {
        Validating: 'Validating',
        Valid: 'Valid',
        Invalid: 'Invalid'
    }

    const [token, setToken] = useState(null);
    const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);

    useEffect(() => {
        const { token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        history.replace(location.pathname);

        accountService.validateResetToken(token)
            .then(() => {
                setToken(token);
                setTokenStatus(TokenStatus.Valid);
            })
            .catch(() => {
                setTokenStatus(TokenStatus.Invalid);
            });
    }, []);

    function getForm() {
        const init = {
            password: '',
            confirmedPassword: ''
        };

        const validation = Yup.object().shape({
            password: Yup.string()
                .min(5, 'At least 5 characters must be in password')
                .max(15, 'Maximum 15 characters must be in password')
                .required('Password field is required'),
            confirmedPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Password confirmation field is required'),
        });

        function onSubmit({ password, confirmedPassword }, { setSubmitting }) {
            alertService.clear();
            accountService.resetPassword({ token, password, confirmedPassword })
                .then(() => {
                    alertService.success('Password reseting step is successful, you can login in your account now.', { keepAfterRouteChange: true });
                    history.push('login');
                })
                .catch(error => {
                    setSubmitting(false);
                    alertService.error(error);
                });
        }

        return (
            <Formik initialValues={init} validationSchema={validation} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <label>New password:</label>
                            <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label>Password confirmation:</label>
                            <Field name="confirmedPassword" type="password" className={'form-control' + (errors.confirmedPassword && touched.confirmedPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmedPassword" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Reset password
                                </button>
                                <Link to="login" className="btn btn-link">Cancel</Link>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    }

    function getBody() {
        switch (tokenStatus) {
            case TokenStatus.Valid:
                return getForm();
            case TokenStatus.Invalid:
                return <div>Password reseting step is failed, you can reset your password using the <Link to="forgot-password">forgot password</Link> page.</div>;
            case TokenStatus.Validating:
                return <div>Validating token...</div>;
        }
    }

    return (
        <div>
            <h3 className="card-header">Reseting password</h3>
            <div className="card-body">{getBody()}</div>
        </div>
    )
}

export { ResetPassword }; 
