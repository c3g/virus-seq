import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Input, Label, TextArea } from 'web-toolkit'
import { update } from '../../store/auth'
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

export default function EditDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const isLoading = useSelector(s => s.auth.isLoading)
  const user = useSelector(s => s.auth.user)
  const error = useSelector(s => s.auth.error)
  const dispatch = useDispatch()

  const [validationMessage, setValidationMessage] = useState(undefined)

  const onEdit = ev => {
    ev.preventDefault()
    setIsEditing(true)
  }

  const onSubmit = ev => {
    ev.preventDefault()
    setValidationMessage(undefined)
    const form = ev.target

    const data = {
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      institution: form.elements.institution.value,
      institutionAddress: form.elements.institutionAddress.value,
      lab: form.elements.lab.value,
    }

    Object.keys(data).forEach(key => {
      if (data[key] === user[key])
        delete data[key]
    })

    if (Object.keys(data).length === 0)
      return setIsEditing(false)

    data.id = user.id

    dispatch(update(data))
    .then(ok => {
      if (ok)
        setIsEditing(false)
    })
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>

      <fieldset>
        <legend>Details</legend>
        <Box vertical>
          <Box horizontal align>
            <label htmlFor='firstName'>First Name</label>
            <Input id='firstName' type='text' required defaultValue={user.firstName} disabled={!isEditing} />
            <label htmlFor='lastName'>Last Name</label>
            <Input id='lastName' type='text' required defaultValue={user.lastName} disabled={!isEditing} />
          </Box>
          <Box horizontal align>
            <label htmlFor='lab'>Lab</label>
            <Input id='lab' type='text' required defaultValue={user.lab} disabled={!isEditing} />
          </Box>
          <Box horizontal align>
            <label htmlFor='institution'>Institution</label>
            <Input id='institution' type='text' required defaultValue={user.institution} disabled={!isEditing} />
          </Box>
          <div>
            <label htmlFor='institutionAddress'>Institution Address</label><br/>
            <TextArea
              id='institutionAddress'
              required
              defaultValue={user.institutionAddress}
              disabled={!isEditing}
            />
          </div>

          {isEditing ?
            <Button
              disabled={isLoading}
              type='submit'
              icon='document-save'
              className={styles.submit}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            :
            <Button
              disabled={isLoading}
              type='button'
              icon='document-edit'
              className={styles.submit}
              onClick={onEdit}
            >
              Edit
            </Button>
          }
          {validationMessage &&
            <Label error>
              {validationMessage}
            </Label>
          }
        </Box>
      </fieldset>
    </form>
  );
}
