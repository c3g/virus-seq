import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isEmail from 'sane-email-validation'
import { Box, Button, Input, Label } from 'web-toolkit'
import errorToJSON from '../../helpers/errorToJSON'
import { invite } from '../../store/user'
import styles from './Users.module.css'


export default function InviteUser() {
  const dispatch = useDispatch()
  const [state, setState] = useState({ isLoading: false, error: undefined })

  const onInvite = ev => {
    ev.preventDefault()
    const element = ev.target.elements.email
    const email = element.value

    if (!isEmail(email)) {
      return setState({ isLoading: false, error: 'Not a valid email' })
    }

    setState({ isLoading: true, error: undefined })
    dispatch(invite(email))
    .then(() => {
      setState({ isLoading: false, error: undefined })
      element.value = ''
    })
    .catch(err => setState({ isLoading: false, error: errorToJSON(err) }))
  }

  return (
    <form className={styles.inviteForm} onSubmit={onInvite}>
      <label htmlFor='email' className='sr-only'>Email</label>
      <Input.Group>
        <Input
          id='email'
          type='email'
          placeholder='Invite new user (email)'
          disabled={state.isLoading}
        />
        <Button loading={state.isLoading} type='submit'>
          Send Invite
        </Button>
      </Input.Group> {state.error &&
        <Label error>
          {state.error.message}
        </Label>
      }
    </form>
  )
}

