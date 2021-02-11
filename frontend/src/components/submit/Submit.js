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
          Note: A TSV (tab separated value) file with the following columns:
          <ul>
            <li>filename: matching sequence's path (for zip files only)</li>
            <li>strain: virus strain (must match sequence's description for fasta files)</li>
            <li>date: collection date</li>
            <li>province: province's name</li>
            <li>age: age of the patient, as either an integer number or "Unknown"</li>
            <li>sex: "M", "F", or "Unknown"</li>
            <li>submitting_lab: lab submitting the sequence</li>
          </ul>
        </div>
        <div>
          <label htmlFor='sequences'>Sequences</label>
          <input
            id='sequences'
            type='file'
            accept='.zip,.fa,.faa,.fasta'
            required
          />
          <a href='/sequences-template.tsv' download><small>Download template</small></a>
        </div>
        <div>
          Note: Either a zip or fasta file.
          For a zip file, the metadata file must contain the <code>"filename"</code>
          column that points to the correct sequence inside the zip.
          For a fasta file, the metadata file <code>"strain"</code> column must
          match the description of a sequence in the fasta file. The strain must
          be a series of non-space characters such as <code>"Canada/Qc-L00210314/2020"</code>.
          The description may contain additional data after the strain identifier,
          such as <code>"{'>'}Canada/Qc-L00210314/2020 seq_method:ONT_ARTIC|assemb_method:bcftools|snv_call_method:nanopolish"</code>
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
