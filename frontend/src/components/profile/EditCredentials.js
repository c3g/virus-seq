import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmail from 'sane-email-validation'
import { Box, Button, Input, Label, LevelBar } from 'web-toolkit'
import getPasswordLevel from '../../helpers/getPasswordLevel'
import { update } from '../../store/auth'
import styles from './Profile.module.css'

export default function EditCredentials() {
  const [isEditing, setIsEditing] = useState(false)
  const [password, setPassword] = useState('')
  const isLoading = useSelector(s => s.auth.isLoading)
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()

  const [validationMessage, setValidationMessage] = useState(undefined)

  const onEdit = ev => {
    ev.preventDefault()
    setIsEditing(true)
  }

  const onSubmit = ev => {
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

    if (data.email === user.email)
      delete data.email

    if (!data.password)
      delete data.password

    if (!data.email && !data.password)
      return setIsEditing(false)

    dispatch(update(data))
    .then(ok => {
      if (ok)
        setIsEditing(false)
    })
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} autocomplete='off'>
      <fieldset>
        <legend>Credentials</legend>
        <Box vertical>
          <Box horizontal align className={styles.formRow}>
            <label htmlFor='email'>Email</label>
            <Input
              id='email'
              type='email'
              required
              defaultValue={user.email}
              disabled={!isEditing}
            />
          </Box>
          {/* Fake password input to disable auto-fill */}
          <input id='password' type='password' name='fakepasswordremembered' style={{ display: 'none' }} />
          <Box horizontal align className={styles.formRow}>
            <label htmlFor='password'>Password</label>
            <Input
              id='realPassword'
              type='password'
              autoComplete='new-password'
              aria-autocomplete='new-password'
              placeholder='(leave empty to keep)'
              minLength={6}
              disabled={!isEditing}
              value={password}
              onChange={setPassword}
            />
            <LevelBar
              value={getPasswordLevel(password)}
            />
          </Box>
          {isEditing ?
            <Button
              disabled={isLoading}
              type='submit'
              icon='document-save'
              className={styles.submit}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            :
            <Button
              disabled={isLoading}
              type='button'
              icon='document-edit'
              className={styles.submit}
              onClick={onEdit}
            >
              Edit
            </Button>
          }
          {validationMessage &&
            <Label error>
              {validationMessage}
            </Label>
          }
        </Box>
      </fieldset>
    </form>
  );
}
