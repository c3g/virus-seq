import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Expander, Input, Label } from 'web-toolkit'
import { StyledDropZone as DropZone } from 'react-drop-zone'
import cx from 'clsx'
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
    const name = form.elements.name.value || null
    const metadata = form.elements.metadata.files[0]
    const sequences = form.elements.sequences.files[0]
    setMessage(undefined)
    dispatch(submit(name, metadata, sequences))
    .then(results => {
      if (results) {
        form.elements.name.value = ''
        form.elements.metadata.value = []
        form.elements.sequences.value = []
        setMessage('Data has been successfully submitted')
      }
    })
  }

  return (
    <div className={cx('background', styles.container)}>
      <h2>Submit</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <table styles={styles.table}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <Label htmlFor='name' className={styles.label}>Name</Label>
              </td>
            </tr>
            <tr className={styles.inputRow}>
              <td>
                <Input
                  id='name'
                  size='large'
                  placeholder='(Optional)'
                />
              </td>
              <td>
                Name for this upload
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <Label htmlFor='metadata' className={styles.label}>Metadata</Label>
              </td>
            </tr>
            <tr className={styles.inputRow}>
              <td>
                <DropZone
                  id='metadata'
                  accept='.csv,.tsv'
                  required
                />
                <br/>
                <a href='/metadata-template.tsv' download><small>Download template</small></a>
              </td>
              <td>
                A TSV (tab separated value) file with the following columns:
                <table className={styles.descriptions}>
                  <tbody>
                    <tr>
                      <td>filename</td><td>matching sequence's path (for zip files only)</td>
                    </tr>
                    <tr>
                      <td>strain</td><td>virus strain (must match sequence's description for fasta files)</td>
                    </tr>
                    <tr>
                      <td>date</td><td>collection date</td>
                    </tr>
                    <tr>
                      <td>province</td>
                      <td>
                        <Expander label='province two letter code or name'>
                          <div>
                            ON: 'Ontario',<br/>
                            QC: 'Quebec',<br/>
                            NS: 'Nova Scotia',<br/>
                            NB: 'New Brunswick',<br/>
                            MB: 'Manitoba',<br/>
                            BC: 'British Columbia',<br/>
                            PE: 'Prince Edward Island',<br/>
                            SK: 'Saskatchewan',<br/>
                            AB: 'Alberta',<br/>
                            NL: 'Newfoundland and Labrador',<br/>
                            NT: 'Northwest Territories',<br/>
                            YT: 'Yukon',<br/>
                            NU: 'Nunavut',<br/>
                            or 'Unknown'
                          </div>
                        </Expander>

                      </td>
                    </tr>
                    <tr>
                      <td>age</td><td>age of the patient, as either an integer number or "Unknown"</td>
                    </tr>
                    <tr>
                      <td>sex</td><td>"M", "F", or "Unknown"</td>
                    </tr>
                    <tr>
                      <td>submitting_lab</td><td>lab submitting the sequence</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td colSpan={2}>
                <Label htmlFor='sequences' className={styles.label}>Sequences</Label>
              </td>
            </tr>
            <tr className={styles.inputRow}>
              <td>
                <DropZone
                  id='sequences'
                  accept='.zip,.fa,.faa,.fasta'
                  required
                />
                <br/>
                <Box vertical compact>
                  <a href='/sequences-template.zip' download><small>Download template (.zip)</small></a>
                  <a href='/sequences-template.fasta' download><small>Download template (.fasta)</small></a>
                </Box>
              </td>
              <td>
                Either a zip or fasta file.
                <br/>
                For a zip file, the metadata file must contain the <code>"filename"</code>{' '}
                column that points to the correct sequence inside the zip.
                <br/>
                For a fasta file, the metadata file <code>"strain"</code> column must
                match the description of a sequence in the fasta file. The strain must
                be a series of non-space characters such as <code>Canada/Qc-L00210314/2020</code>.
                The description may contain additional data after the strain identifier,
                such as<br/>
                <code>{'>'}Canada/Qc-L00210314/2020 seq_method:ONT_ARTIC|assemb_method:bcftools</code>
              </td>
            </tr>
          </tbody>
        </table>

        <Button size='large' primary disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </Button>

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
