import React from 'react'
import { useSelector } from 'react-redux'
import { Label } from 'web-toolkit'
import Page from '../page'
import EditCredentials from './EditCredentials'
import EditDetails from './EditDetails'

/* type: DataTypes.ENUM(Object.values(USER_TYPE)),
 * firstName: DataTypes.STRING,
 * lastName: DataTypes.STRING,
 * institution: DataTypes.STRING,
 * institutionAddress: DataTypes.STRING,
 * lab: DataTypes.STRING,
 * email: { type: DataTypes.STRING, unique: true },
 * password: DataTypes.STRING,
 * token: DataTypes.STRING(36), */

export default function Profile() {
  const error = useSelector(s => s.auth.error)

  return (
    <Page>
      <h2>Profile</h2>

      {error &&
        <Label error>
          {error.message}
        </Label>
      }

      <EditCredentials />
      <EditDetails />
    </Page>
  );
}
