import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Button, Input, Label, Table } from 'web-toolkit'
import Page from '../page'
import InviteUser from './InviteUser'
import styles from './Users.module.css'

export default function Users() {
  const isLoading = useSelector(s => s.user.isLoading)
  const users = useSelector(s => s.user.list)
  const error = useSelector(s => s.user.error)

  const columns = [
    { Header: 'ID', accessor: user => user.id },
    { Header: 'Name', accessor: user => user.firstName },
    { Header: 'Email', accessor: user => user.email },
    { Header: 'Lab', accessor: user => user.lab },
    { Header: 'Institution', accessor: user => user.institution },
    { Header: 'Address', accessor: user => user.institutionAddress?.replace(/\n/g, ', ') },
    { Header: 'Type', accessor: user => user.type },
    { Header: 'Signed Up', accessor: user => String(user.password) },
  ]

  return (
    <Page>
      <h2>Users</h2>
      <br/>

      <div className={styles.inviteContainer}>
        <InviteUser />
      </div>

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
