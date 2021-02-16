import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmail from 'sane-email-validation'
import { Box, Button, Input, Label } from 'web-toolkit'
import { update } from '../../store/auth'
import styles from './Profile.module.css'

export default function EditCredentials() {
  const [isEditing, setIsEditing] = useState(false)
  const isLoading = useSelector(s => s.auth.isLoading)
  const user = useSelector(s => s.auth.user)
  const error = useSelector(s => s.auth.error)
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

    if (!data.password)
      delete data.password

    dispatch(update(data))
    .then(ok => {
      if (ok)
        setIsEditing(false)
    })
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <fieldset>
        <legend>Credentials</legend>
        <Box vertical>
          <Box horizontal align>
            <label htmlFor='email'>Email</label>
            <Input
              id='email'
              type='email'
              required
              defaultValue={user.email}
              disabled={!isEditing}
            />
          </Box>
          <Box horizontal align>
            <label htmlFor='password'>Password</label>
            {/* Fake password input to disable auto-fill */}
            <input id='password' type='password' name='fakepasswordremembered' style={{ display: 'none' }} />
            <Input
              id='realPassword'
              type='password'
              autoComplete='new-password'
              placeholder='(leave empty to keep)'
              minLength={6}
              disabled={!isEditing}
            />
          </Box>
          {isEditing ?
            <Button
              disabled={isLoading}
              type='submit'
              icon='document-save'
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            :
            <Button
              disabled={isLoading}
              type='button'
              icon='document-edit'
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
