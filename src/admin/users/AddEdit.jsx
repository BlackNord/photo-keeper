import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;

    const init = {
        name: '',
        surname: '',
        email: '',
        role: '',
        password: '',
        confirmedPassword: ''
    };

    const validation = Yup.object().shape({
        name: Yup.string()
            .required('Name field is required'),
        surname: Yup.string()
            .required('Surname field is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email field is required'),
        role: Yup.string()
            .required('Role field is required'),
        password: Yup.string()
            .concat(isAddMode ? Yup.string().required('Password field is required') : null)
            .min(5, 'At least 5 characters must be in password')
            .max(15, 'Maximum 15 characters must be in password')
            .notOneOf([Yup.ref('email')], 'Email and password don\'t must match'),
        confirmedPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password)
                    return schema.required('Password confirmation field is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createUser(fields, setSubmitting);
        }
        else {
            updateUser(id, fields, setSubmitting);
        }
    }

    function createUser(fields, setSubmitting) {
        accountService.create(fields)
            .then(() => {
                alertService.success('User was added successfully.', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, setSubmitting) {
        accountService.update(id, fields)
            .then(() => {
                alertService.success('User updating proccess was successfully finished.', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <Formik initialValues={init} validationSchema={validation} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        accountService.getById(id).then(user => {
                            const fields = ['name', 'surname', 'email', 'role'];
                            fields.forEach(field => setFieldValue(field, user[field], false));
                        });
                    }
                }, []);

                return (
                    <Form>
                        <h1>{isAddMode ? 'Add user' : 'Edit user'}</h1>
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
                        <div className="form-row">
                            <div className="form-group col-7">
                                <label>Email:</label>
                                <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Role:</label>
                                <Field name="role" as="select" className={'form-control' + (errors.role && touched.role ? ' is-invalid' : '')}>
                                    <option value=""></option>
                                    <option value="User">User</option>
                                    <option value="Administrator">Administrator</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        {!isAddMode &&
                            <div>
                                <h3 className="pt-3">Password changing:</h3>
                                <p>You can leave it blank to keep the same password</p>
                            </div>
                        }
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
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                            <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export { AddEdit };
