import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { indexBy, prop } from 'rambda'
import { format } from 'date-fns'
import { USER_TYPE } from '../../constants'
import styles from './Sequences.module.css'

export default function Sequences() {
  const isLoading = useSelector(s => s.sequence.isLoading)
  const users = useSelector(s => s.user.list)
  const usersByID = useMemo(() => indexBy(prop('id'), users), [users])
  const sequences = useSelector(s => s.sequence.list)
  const error = useSelector(s => s.sequence.error)
  const isAdmin = useSelector(s => s.auth.user?.isAdmin)

  return (
    <div>
      <h2>Sequences</h2>

      {error &&
        <div>
          {error.message}
        </div>
      }

      <table className={styles.table}>
        <thead>
          <tr>
            <td>ID</td>
            <td>Strain</td>
            <td>Collection Date</td>
            <td>Age</td>
            <td>Sex</td>
            <td>Province</td>
            <td>Lab</td>
            <td>Data (size)</td>
            {isAdmin && <td>User</td>}
          </tr>
        </thead>
        <tbody>
          {sequences.map(sequence =>
            <tr key={sequence.id}>
              <td>{sequence.id}</td>
              <td>{sequence.strain}</td>
              <td>{safeFormat(sequence.collectionDate)}</td>
              <td>{sequence.age}</td>
              <td>{sequence.sex}</td>
              <td>{sequence.province}</td>
              <td>{sequence.lab}</td>
              <td>{sequence.data}</td>
              {isAdmin && <td>{usersByID[sequence.userId].email}</td>}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function safeFormat(date) {
  if (!date)
    return null
  return format(new Date(date), 'd MMM yyyy')
}
