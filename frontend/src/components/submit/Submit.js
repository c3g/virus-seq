import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, Expander, Input, Label } from 'web-toolkit'
import { StyledDropZone as DropZone } from 'react-drop-zone'
import Page from '../page'
import { submit } from '../../store/sequence'
import styles from './Submit.module.css'



export default function Submit() {
  const isLoading = useSelector(s => s.sequence.isLoading)
  const error = useSelector(s => s.sequence.error)
  const dispatch = useDispatch()
  const [message, setMessage] = useState(undefined)
  const [metadata, setMetadata] = useState(undefined)
  const [sequences, setSequences] = useState(undefined)

  const onSubmit = ev => {
    ev.preventDefault()
    const form = ev.target
    const name = form.elements.name.value || null
    setMessage(undefined)
    dispatch(submit(name, metadata, sequences))
    .then(results => {
      if (results) {
        form.elements.name.value = ''
        setMetadata(undefined)
        setSequences(undefined)
        setMessage('Data has been successfully submitted')
      }
    })
  }

  return (
    <Page center='horizontal'>
      <Box vertical className={styles.container}>
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
                  <div className={styles.help}>
                    Name for this upload
                  </div>
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
                    required
                    id='metadata'
                    accept='.csv,.tsv'
                    children={metadata?.name}
                    onDrop={setMetadata}
                  />
                  <br/>
                  <a href='/metadata-template.tsv' download><small>Download template</small></a>
                </td>
                <td>
                  <div className={styles.help}>
                    A TSV (tab separated value) file with the following columns:
                    <table className={styles.descriptions}>
                      <tbody>
                        <tr>
                          <td><code>filename</code></td><td>matching sequence's path (for zip files only)</td>
                        </tr>
                        <tr>
                          <td><code>strain</code></td><td>virus strain (must match sequence's description for fasta files)</td>
                        </tr>
                        <tr>
                          <td><code>date</code></td><td>collection date</td>
                        </tr>
                        <tr>
                          <td><code>province</code></td>
                          <td>
                            <Expander label='province two letter code or name'>
                              <pre>
                                ON: 'Ontario'<br/>
                                QC: 'Quebec'<br/>
                                NS: 'Nova Scotia'<br/>
                                NB: 'New Brunswick'<br/>
                                MB: 'Manitoba'<br/>
                                BC: 'British Columbia'<br/>
                                PE: 'Prince Edward Island'<br/>
                                SK: 'Saskatchewan'<br/>
                                AB: 'Alberta'<br/>
                                NL: 'Newfoundland and Labrador'<br/>
                                NT: 'Northwest Territories'<br/>
                                YT: 'Yukon'<br/>
                                NU: 'Nunavut'<br/>
                                or 'Unknown'
                              </pre>
                            </Expander>

                          </td>
                        </tr>
                        <tr>
                          <td><code>age</code></td><td>age of the patient, as either an integer number or empty</td>
                        </tr>
                        <tr>
                          <td><code>sex</code></td><td><code>M</code>, <code>F</code>, <code>Unknown</code> or empty</td>
                        </tr>
                        <tr>
                          <td><code>submitting_lab</code></td><td>lab submitting the sequence</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                    required
                    id='sequences'
                    accept='.zip,.fa,.faa,.fasta'
                    children={sequences?.name}
                    onDrop={setSequences}
                  />
                  <br/>
                  <Box vertical compact>
                    <a href='/sequences-template.zip' download><small>Download template (.zip)</small></a>
                    <a href='/sequences-template.fasta' download><small>Download template (.fasta)</small></a>
                  </Box>
                </td>
                <td>
                  <div className={styles.help}>
                    For a zip file, the metadata file must contain the <code>filename</code>{' '}
                    column that points to the correct sequence inside the zip.
                    <br/>
                    <br/>
                    For a fasta file, the metadata file <code>strain</code> column must
                    match the description of a sequence in the fasta file. The strain must
                    be a series of non-space characters such as <code>Canada/Qc-L00210314/2020</code>.
                    The description may contain additional data after the strain identifier,
                    such as<br/>
                    <code>{'>'}<b>Canada/Qc-L00210314/2020</b> seq_method:ONT_ARTIC|...</code>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <Button size='large' primary disabled={isLoading} type='submit'>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
          {message &&
            <Label success style={{ marginLeft: '1rem' }}>
              {message}
            </Label>
          }

          {error &&
            <div>
              {error.message}
            </div>
          }
        </form>
      </Box>
    </Page>
  );
}
