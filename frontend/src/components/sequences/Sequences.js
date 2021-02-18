import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Table } from 'web-toolkit'
import { prop, groupBy } from 'rambda'
import { PROVINCE } from '../../constants'
import Page from '../page'
import Chart from './Chart'
import styles from './Sequences.module.css'

export default function Sequences() {
  const usersById = useSelector(s => s.user.byId)
  const uploadsById = useSelector(s => s.upload.byId)
  const sequences = useSelector(s => s.sequence.list)
  const error = useSelector(s => s.sequence.error)
  const isAdmin = useSelector(s => s.auth.user?.isAdmin)
  const provinceData = useMemo(() => getProvinceData(sequences), [sequences])

  const columns = [
    {
      Header: 'Metadata',
      columns: [
        {
          Header: 'ID',
          accessor: s => s.id,
          width: 30,
        },
        {
          Header: 'Strain',
          accessor: 'strain',
        },
        {
          Header: 'Age',
          accessor: 'age',
          width: 40,
        },
        {
          Header: 'Sex',
          accessor: 'sex',
          width: 40,
        },
        {
          Header: 'Province',
          accessor: 'province',
          width: 40,
        },
        {
          Header: 'Lab',
          accessor: 'lab',
          width: 80,
        },
        {
          Header: 'Collection Date',
          accessor: s => safeFormat(s.collectionDate),
        },
        {
          Header: 'Data (size)',
          accessor: 'data',
        },
      ],
    },
    {
      Header: 'Upload',
      columns: [
        {
          Header: 'Date',
          accessor: s => safeFormat(uploadsById[s.uploadId].createdAt),
        },
        {
          Header: 'Name',
          accessor: s => renderUpload(uploadsById[s.uploadId]),
        },
        !isAdmin ? null :
          {
            Header: 'User',
            accessor: s => usersById[uploadsById[s.uploadId].userId].email,
          },
      ].filter(Boolean),
    },
  ]
  .filter(Boolean)

  return (
    <Page>
      <h2 className={styles.title}>Sequences</h2>

      {error &&
        <div>
          {error.message}
        </div>
      }

      {isAdmin &&
        <Chart
          className={styles.chart}
          total={sequences.length}
          data={provinceData}
        />
      }
      <Table
        key={sequences.length}
        columns={columns}
        data={sequences}
        sortable={true}
        filterable={true}
        style={{ height: 400 }}
      />
    </Page>
  )
}

function getProvinceData(sequences) {
  return Object.entries(
    groupBy(prop('province'), sequences)
  )
  .map(([provinceCode, sequences]) => ({
    name: PROVINCE[provinceCode],
    value: sequences.length,
  }))
}

function renderUpload(upload) {
  return upload.name || `#${upload.id}`
}

function safeFormat(date) {
  if (!date)
    return null
  return format(new Date(date), 'd MMM yyyy')
}
