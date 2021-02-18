import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Icon, Label } from 'web-toolkit'
import Page from '../page'
import EditCredentials from './EditCredentials'
import EditDetails from './EditDetails'
import styles from './Profile.module.css'

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
  const user = useSelector(s => s.auth.user)
  const error = useSelector(s => s.auth.error)

  return (
    <Page center='horizontal'>
      <Box vertical align='stretch'>
        <Box horizontal align className={styles.welcome}>
          <Icon
            name='avatar-default'
            className={styles.welcomeIcon}
          />
          <Label className={styles.welcomeLabel}>
            Welcome, {user.firstName}
          </Label>
        </Box>

        {error &&
          <Label error>
            {error.message}
          </Label>
        }

        <Box vertical align='start'>
          <EditCredentials />
          <EditDetails />
        </Box>
      </Box>
    </Page>
  );
}
