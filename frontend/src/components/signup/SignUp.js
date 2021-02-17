import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import isEmail from 'sane-email-validation'
import { Box, Button, Input, Label, LevelBar, TextArea } from 'web-toolkit'
import getPasswordLevel from '../../helpers/getPasswordLevel'
import { signup } from '../../store/auth'
import Page from '../page'
import routes from '../routes'
import styles from './SignUp.module.css'

/* type: DataTypes.ENUM(Object.values(USER_TYPE)),
 * firstName: DataTypes.STRING,
 * lastName: DataTypes.STRING,
 * institution: DataTypes.STRING,
 * institutionAddress: DataTypes.STRING,
 * lab: DataTypes.STRING,
 * email: { type: DataTypes.STRING, unique: true },
 * password: DataTypes.STRING,
 * token: DataTypes.STRING(36), */

export default function SignUp() {
  const searchParams = new URLSearchParams(window.location.search)
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()
  const [password, setPassword] = useState('')

  const [validationMessage, setValidationMessage] = useState(undefined)

  const onSubmit = ev => {
    ev.preventDefault()
    setValidationMessage(undefined)
    const form = ev.target

    const data = {
      token: form.elements.token.value,
      email: form.elements.email.value,
      password: form.elements.password.value,
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      institution: form.elements.institution.value,
      institutionAddress: form.elements.institutionAddress.value,
      lab: form.elements.lab.value,
    }

    if (!isEmail(data.email))
      return setValidationMessage('Email is invalid')

    dispatch(signup(data))
    .then(user => {
      if (user)
        history.push(routes.byName.afterSignUp)
    })
  }

  console.log(styles)
  return (
    <Page center='horizontal'>
      <form className={styles.form} onSubmit={onSubmit}>
        <h1>Sign Up</h1>

        <input id='token' type='hidden' value={searchParams.get('token')} />
        <Box vertical>
          <fieldset>
            <legend>Credentials</legend>
            <Box vertical>
              <Box horizontal align className={styles.formRow}>
                <label htmlFor='email'>Email</label>
                <Input id='email' type='email' required defaultValue={searchParams.get('email')} />
              </Box>
              <Box horizontal align className={styles.formRow}>
                <label htmlFor='password'>Password</label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Choose a strong password'
                  required
                  value={password}
                  onChange={setPassword}
                  minLength={6}
                />
                <LevelBar
                  value={getPasswordLevel(password)}
                />
              </Box>
            </Box>
          </fieldset>

          <fieldset>
            <legend>Identification</legend>
            <Box horizontal align>
              <label htmlFor='firstName'>First Name</label>
              <Input id='firstName' type='text' required />
              <label htmlFor='lastName'>Last Name</label>
              <Input id='lastName' type='text' required />
            </Box>
          </fieldset>

          <fieldset>
            <legend>Organization</legend>

            <Box vertical>
              <Box horizontal align className={styles.formRow}>
                <label htmlFor='lab'>Lab</label>
                <Input
                  id='lab'
                  type='text'
                  placeholder='Lab name'
                  required
                />
              </Box>
              <Box horizontal align className={styles.formRow}>
                <label htmlFor='institution'>Institution</label>
                <Input
                  id='institution'
                  type='text'
                  placeholder='Institution name'
                  required
                />
              </Box>
              <div>
                <label htmlFor='institutionAddress'>Institution Address</label><br/>
                <TextArea
                  id='institutionAddress'
                  required
                  className={styles.address}
                />
              </div>
            </Box>
          </fieldset>

          <Button
            disabled={isLoading}
            icon='mail-send'
            type='submit'
          >
            {isLoading ? 'Signing In...' : 'Sign Up'}
          </Button>
          {validationMessage &&
            <Label danger>
              {validationMessage}
            </Label>
          }
          {error &&
            <Label danger>
              {error.message}
            </Label>
          }
        </Box>
      </form>
    </Page>
  );
}
