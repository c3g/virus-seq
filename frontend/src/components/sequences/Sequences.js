import React from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Table } from 'web-toolkit'
import cx from 'clsx'
import Page from '../page'
import styles from './Sequences.module.css'

export default function Sequences() {
  const usersById = useSelector(s => s.user.byId)
  const uploadsById = useSelector(s => s.upload.byId)
  const sequences = useSelector(s => s.sequence.list)
  const error = useSelector(s => s.sequence.error)
  const isAdmin = useSelector(s => s.auth.user?.isAdmin)

  const columns = [
    {
      Header: 'ID',
      accessor: s => s.id,
      width: 30,
      disableFilters: true,
    },
    {
      Header: 'Strain',
      accessor: 'strain',
      disableFilters: true,
    },
    {
      Header: 'Age',
      accessor: 'age',
      width: 40,
      disableFilters: true,
    },
    {
      Header: 'Sex',
      accessor: 'sex',
      width: 40,
      disableFilters: true,
    },
    {
      Header: 'Province',
      accessor: 'province',
      width: 40,
      disableFilters: true,
    },
    {
      Header: 'Lab',
      accessor: 'lab',
      width: 80,
      disableFilters: true,
    },
    {
      Header: 'Collection Date',
      accessor: s => safeFormat(s.collectionDate),
      disableFilters: true,
    },
    {
      Header: 'Upload',
      accessor: s => renderUpload(uploadsById[s.uploadId]),
      disableFilters: true,
    },
    !isAdmin ? null :
      {
        Header: 'User',
        accessor: s => usersById[uploadsById[s.uploadId].userId].email,
        disableFilters: true,
      },
    {
      Header: 'Data (size)',
      accessor: 'data',
      disableFilters: true,
    },
  ]
  .filter(Boolean)

  return (
    <Page>
      <h2>Sequences</h2>

      {error &&
        <div>
          {error.message}
        </div>
      }

      <Table
        key={sequences.length}
        columns={columns}
        data={sequences}
        sortable={true}
        filterable={true}
        style={{ height: 500 }}
      />
    </Page>
  )
}

function renderUpload(upload) {
  const { createdAt } = upload
  const name = upload.name || `#${upload.id}`

  return <span>{name} <small>({format(new Date(createdAt), 'd MMM yyyy')})</small></span>
}

function safeFormat(date) {
  if (!date)
    return null
  return format(new Date(date), 'd MMM yyyy')
}
