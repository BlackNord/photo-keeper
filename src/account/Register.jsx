import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Register({ history }) {
    const init = {
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmedPassword: '',
        acceptTerms: false
    };

    const validation = Yup.object().shape({
        name: Yup.string()
            .required('Name field is required'),
        surname: Yup.string()
            .required('Surname field is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email field is required'),
        password: Yup.string()
            .notOneOf([Yup.ref('email')], 'Email and password don\'t must match')
            .min(5, 'At least 5 characters must be in password')
            .max(15, 'Maximum 15 characters must be in password')
            .required('Password field is required'),
        confirmedPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password confirmation field is required'),
        acceptTerms: Yup.bool()
            .oneOf([true], 'Accept Terms&Conditions is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();

        accountService.register(fields)
            .then(() => {
                alertService.success('Registration step is successful, please check your email for verification instructions.', { keepAfterRouteChange: true });
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
                    <h3 className="card-header">Register your account</h3>
                    <div className="card-body">
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label>Name:</label>
                                <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label>Surname:</label>
                                <Field name="surname" type="text" className={'form-control' + (errors.surname && touched.surname ? ' is-invalid' : '')} />
                                <ErrorMessage name="surname" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Password:</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Password confirmation:</label>
                                <Field name="confirmedPassword" type="password" className={'form-control' + (errors.confirmedPassword && touched.confirmedPassword ? ' is-invalid' : '')} />
                                <ErrorMessage name="confirmedPassword" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group form-check">
                            <Field type="checkbox" name="acceptTerms" id="acceptTerms" className={'form-check-input ' + (errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : '')} />
                            <label htmlFor="acceptTerms" className="form-check-label">Accept Terms&Conditions</label>
                            <ErrorMessage name="acceptTerms" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Register
                            </button>
                            <Link to="login" className="btn btn-link">Cancel</Link>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Register }; 
