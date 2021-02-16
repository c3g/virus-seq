import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Box, Button, Input, Label } from 'web-toolkit'
import { resetPassword, changePassword } from '../../store/auth'
import routes from '../routes'
import Page from '../page'
import styles from './Forgot.module.css'

export default function Forgot() {
  const searchParams = new URLSearchParams(window.location.search)
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const hasData = Boolean(email && token)

  return (
    <Page>
      {hasData ?
        <ChangePassword email={email} token={token} /> :
        <ResetPassword />
      }
    </Page>
  );
}

function ChangePassword({ email, token }) {
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const password = form.elements.password.value
    dispatch(changePassword({ email, token, password }))
    .then(user => {
      if (user)
        history.push(routes.byName.afterLogin)
    })
  }

  return (
    <div>
      <form className={styles.form} onSubmit={onSubmit}>
        <Box vertical>
          <h1>Change Passowrd</h1>
          <label htmlFor='password'>Password</label>
          <Input
            required
            id='password'
            type='password'
            size='huge'
            disabled={isLoading}
          />
          <Button size='huge' disabled={isLoading} type='submit'>
            {isLoading ? 'Updating...' : 'Set New Password'}
          </Button>
        </Box>
        {error &&
          <Label error>
            {error.message}
          </Label>
        }
      </form>
    </div>
  );
}

function ResetPassword() {
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()
  const [didReset, setDidReset] = useState(false)

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const email = form.elements.email.value
    dispatch(resetPassword(email))
    .then(() => setDidReset(true))
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Box vertical>
        <h1>Forgot Password?</h1>
        {didReset &&
          <div>
            Password reset link sent.
          </div>
        }
        {!didReset &&
          <>
            <label htmlFor='email' className='sr-only'>Email</label>
            <Input
              id='email'
              type='email'
              size='huge'
              placeholder='Email'
              required
            />
            <Button size='huge' disabled={isLoading} type='submit'>
              {isLoading ? 'Sending...' : 'Reset Password'}
            </Button>
          </>
        }
      </Box>
      {error &&
        <div>
          {error.message}
        </div>
      }
    </form>
  )
}
