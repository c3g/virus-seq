import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { submit } from '../../store/sequence'
import styles from './Submit.module.css'

export default function Submit() {
  const isLoading = useSelector(s => s.sequence.isLoading)
  const error = useSelector(s => s.sequence.error)
  const dispatch = useDispatch()
  const [message, setMessage] = useState(undefined)

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const metadata = form.elements.metadata.files[0]
    const sequences = form.elements.sequences.files[0]
    setMessage(undefined)
    dispatch(submit(metadata, sequences))
    .then(results => {
      if (results) {
        form.elements.metadata.value = []
        form.elements.sequences.value = []
        setMessage('Data has been successfully submitted')
      }
    })
  }

  return (
    <div>
      <h2>Submit</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <div>
          <label htmlFor='metadata'>Metadata</label>
          <input id='metadata' type='file' accept='.csv,.tsv' required />
          <a href='/metadata-template.tsv' download><small>Download template</small></a>
        </div>
        <div>
          <label htmlFor='sequences'>Sequences</label>
          <input id='sequences' type='file' accept='.zip' required />
          <a href='/sequences-template.tsv' download><small>Download template</small></a>
        </div>

        <button disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        {message &&
          <div>
            {message}
          </div>
        }

        {error &&
          <div>
            {error.message}
          </div>
        }
      </form>
    </div>
  );
}
