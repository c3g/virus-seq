import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import isEmail from 'sane-email-validation'
import { update } from '../../store/auth'
import routes from '../routes'
import styles from './Profile.module.css'

/* type: DataTypes.ENUM(Object.values(USER_TYPE)),
 * firstName: DataTypes.STRING,
 * lastName: DataTypes.STRING,
 * institution: DataTypes.STRING,
 * institutionAddress: DataTypes.STRING,
 * lab: DataTypes.STRING,
 * email: { type: DataTypes.STRING, unique: true },
 * password: DataTypes.STRING,
 * token: DataTypes.STRING(36), */

export default function Profile() {
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const user = useSelector(s => s.auth.user)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const [validationMessage, setValidationMessage] = useState(undefined)

  const onSubmitCredentials = ev => {
    ev.preventDefault()
    setValidationMessage(undefined)
    const form = ev.target

    const email = form.elements.email.value
    const password = form.elements.realPassword.value

    if (!isEmail(email))
      return setValidationMessage('Email is invalid')

    const data = {
      id: user.id,
      email,
      password,
    }

    if (!data.password)
      delete data.password

    dispatch(update(data))
  }

  const onSubmitDetails = ev => {
    ev.preventDefault()
    setValidationMessage(undefined)
    const form = ev.target

    const data = {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      institution: form.elements.institution.value,
      institutionAddress: form.elements.institutionAddress.value,
      lab: form.elements.lab.value,
    }

    Object.keys(data).forEach(key => {
      if (data[key] === user[key])
        delete data[key]
    })

    if (Object.keys(data).length === 0)
      return

    data.id = user.id

    dispatch(update(data))
  }

  return (
    <div>
      <h2>Profile</h2>

      {validationMessage &&
        <div>
          {validationMessage}
        </div>
      }
      {error &&
        <div>
          {error.message}
        </div>
      }

      <h3>Credentials</h3>
      <form className={styles.form} onSubmit={onSubmitCredentials}>
        <fieldset>
          <legend>Credentials</legend>
          <label htmlFor='email'>Email</label>
          <input id='email' type='email' required defaultValue={user.email} />
          <label htmlFor='password'>Password</label>
          {/* Fake password input to disable auto-fill */}
          <input id='password' type='password' name='fakepasswordremembered' style={{ display: 'none' }} />
          <input
            id='realPassword'
            type='password'
            required
            autoComplete='new-password'
            placeholder='(leave empty to keep)'
            minLength={6}
          />
          <button disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </fieldset>
      </form>

      <h3>Other Details</h3>
      <form className={styles.form} onSubmit={onSubmitDetails}>

        <fieldset>
          <legend>Identification</legend>
          <label htmlFor='firstName'>First Name</label>
          <input id='firstName' type='text' required defaultValue={user.firstName} />
          <label htmlFor='lastName'>Last Name</label>
          <input id='lastName' type='text' required defaultValue={user.lastName} />
        </fieldset>

        <fieldset>
          <legend>Organization</legend>

          <div>
            <label htmlFor='lab'>Lab</label>
            <input id='lab' type='text' required defaultValue={user.lab} />
          </div>
          <div>
            <label htmlFor='institution'>Institution</label>
            <input id='institution' type='text' required defaultValue={user.institution} />
          </div>
          <div>
            <label htmlFor='institutionAddress'>Institution Address</label><br/>
            <textarea id='institutionAddress' required defaultValue={user.institutionAddress} />
          </div>
        </fieldset>

        <button disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
