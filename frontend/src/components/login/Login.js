import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
} from 'web-toolkit'
import cx from 'clsx'
import { login } from '../../store/auth'
import routes from '../routes'
import styles from './Login.module.css'

export default function Login() {
  const history = useHistory()
  const isLoading = useSelector(s => s.auth.isLoading)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const email = form.elements.email.value
    const password = form.elements.password.value
    dispatch(login({ email, password }))
    .then(() => history.push(routes.byName.afterLogin))
  }

  return (
    <div className={cx('background', styles.container)}>
      <form className={styles.form} onSubmit={onSubmit}>
        <label className='sr-only' htmlFor='email'>Email</label>
        <label className='sr-only' htmlFor='password'>Password</label>

        <Box vertical>
          <Box vertical compact className='linked' style={{ minWidth: 130 }}>
            <Input
              size='huge'
              id='email'
              type='text'
              placeholder='Email'
            />
            <Input
              size='huge'
              id='password'
              type='password'
              placeholder='Password'
            />
          </Box>

          <Button size='huge' disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login'}
          </Button> <Link to={routes.byName.forgot}><small>Forgot password?</small></Link>

          {error &&
            <div>
              {error.message}
            </div>
          }
        </Box>
      </form>
    </div>
  );
}
