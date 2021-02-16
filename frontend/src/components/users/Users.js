import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Dropdown, Icon, Input, Label, Table,  } from 'web-toolkit'
import { update } from '../../store/user'
import { USER_TYPE } from '../../constants'
import Page from '../page'
import InviteUser from './InviteUser'
import styles from './Users.module.css'

const userTypes = Object.values(USER_TYPE).map(t => ({ value: t, label: t }))

export default function Users() {
  const dispatch = useDispatch()
  const isLoading = useSelector(s => s.user.isLoading)
  const currentUser = useSelector(s => s.auth.user)
  const users = useSelector(s => s.user.list)
  const error = useSelector(s => s.user.error)

  const onUpdateUser = (id, data) => {
    if (id === currentUser.id)
      return
    dispatch(update({ id, ...data }))
    .then(result => {
      console.log(result)
    })
  }

  const columns = [
    { Header: 'ID', accessor: user => user.id, width: 30 },
    { Header: 'Name', accessor: user => empty([user.firstName, user.lastName].filter(Boolean).join(' ')) },
    { Header: 'Email', accessor: user => user.email },
    { Header: 'Lab', accessor: user => empty(user.lab), width: 100 },
    { Header: 'Institution', accessor: user => empty(user.institution), width: 100 },
    { Header: 'Address', accessor: user => empty(user.institutionAddress?.replace(/\n/g, ', ')) },
    { Header: 'Type', accessor: user =>
      <Dropdown
        size='mini'
        style={{ width: 90 }}
        value={user.type}
        loading={users.length === 0}
        options={userTypes}
        disabled={user.id === currentUser.id}
        onChange={type => onUpdateUser(user.id, { type })}
      />
    },
    { Header: 'Signed Up', accessor: user =>
      <Icon
        colored={false}
        className={user.password ? 'text-success' : undefined}
        name={user.password ? 'emblem-ok' : 'window-close'}
      />
    },
  ]

  return (
    <Page>
      <h2>Users</h2>
      <br/>

      <div className={styles.inviteContainer}>
        <InviteUser />
      </div>

      {error &&
        <>
          <Label danger>
            Error: {error.message}
          </Label>
          <br/>
        </>
      }

      <Table
        key={users.length}
        columns={columns}
        data={users}
        sortable={true}
        filterable={true}
        style={{ height: 500 }}
      />
    </Page>
  );
}

function empty(value) {
  if (value)
    return value
  return <Label muted>—</Label>
}
