import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { accountService, alertService } from '@/_services';

function Update({ history }) {
    const user = accountService.userValue;

    const init = {
        name: user.name,
        surname: user.surname,
        password: '',
        confirmedPassword: ''
    };

    const validation = Yup.object().shape({
        name: Yup.string()
            .required('Name field is required'),
        surname: Yup.string()
            .required('Surname field is required'),
        password: Yup.string()
            .min(5, 'At least 5 characters must be in password')
            .max(15, 'Maximum 15 characters must be in password'),
        confirmedPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password)
                    return schema.required('Password confirmation field is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        accountService.update(user.id, fields)
            .then(() => {
                alertService.success('User updating proccess was successfully finished.', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        if (confirm('Are you sure to delete your account?')) {
            setIsDeleting(true);
            accountService.delete(user.id)
                .then(() => alertService.success('Account was deleted successfully.'));
        }
    }

    return (
        <Formik initialValues={init} validationSchema={validation} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting }) => (
                <Form>
                    <h1>Profile updating</h1>
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
                    <h3 className="pt-3">Password changing</h3>
                    <p>You can leave it blank to keep the same password</p>
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
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                            {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Update
                        </button>
                        <button type="button" onClick={() => onDelete()} className="btn btn-danger" style={{ width: '75px' }} disabled={isDeleting}>
                            {isDeleting
                                ? <span className="spinner-border spinner-border-sm"></span>
                                : <span>Delete</span>
                            }
                        </button>
                        <Link to="." className="btn btn-link">Cancel</Link>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export { Update };
