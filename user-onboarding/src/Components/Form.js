import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Field, withFormik } from 'formik';
import * as Yup from 'yup';

/*
  deleted:
    state, ✅
    handleChanges, ✅
    handleSubmit
    form onSubmit ✅
    input values ✅
    input onChange ✅
    labels ✅
*/

// Tasks - Add two fields - size, notes. Don't forget to add them to the values in mPTV

const Forms = ({ errors, touched, values, handleSubmit, status }) => {
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div>
      <div className='animal-form'>
        <h1>New User</h1>
        <Form>
          <Field type='text' name='name' placeholder='Enter your Name' />
          {touched.name && errors.name && (
            <p className='error'>{errors.name}</p>
          )}

          <Field type='text' name='email' placeholder='Enter your Email' />
          {touched.email && errors.email && (
            <p className='error'>{errors.email}</p>
          )}

          <Field type='password' name='password' placeholder='Enter Password' />
          {touched.password && errors.password && (
            <p className='error'>{errors.password}</p>
          )}

          <Field
            type='password'
            name='passwordConfirmation'
            placeholder='Re-Enter Password'
          />
          {touched.passwordConfirmation && errors.passwordConfirmation && (
            <p className='error'>{errors.passwordConfirmation}</p>
          )}

          <label className='checkbox-container'>
            Terms of Service
            <Field type='checkbox' name='ToS' checked={values.ToS} />
            <span className='checkmark' />
          </label>

          <button type='submit'>Submit!</button>
        </Form>
      </div>
      <div className='output'>
        {users.map(user => (
          <p key={user.id}>Hello! {user.name}</p>
        ))}
      </div>
    </div>
  );
};

// Higher Order Component - HOC
// Hard to share component / stateful logic (custom hooks)
// Function that takes in a component, extends some logic onto that component,
// returns a _new_ component (copy of the passed in component with the extended logic)
const FormikForm = withFormik({
  mapPropsToValues({ name, email, password, passwordConfirmation }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      passwordConfirmation: passwordConfirmation || '',
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required(),
    password: Yup.string()
      .min(8, 'Password is too short - must be 8 characters minium')
      .required('Password is required'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match',
    ),
  }),

  handleSubmit(values, { setStatus, setErrors }) {
    console.log('form submitted', values);
    if (values.email === 'waffle@syrup.com') {
      setErrors({ email: 'That email is already taken!' });
    } else {
      axios
        .post('https://reqres.in/api/users', values)
        .then(res => {
          setStatus(res.data);
        })
        .catch(error => console.log(error.response));
    }
  },
})(Forms); // currying functions in Javascript

export default FormikForm;
