import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'web-toolkit'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>VIRUS-SEQ PORTAL</h1>
      <p className={styles.subtitle}>
        Welcome to the virus-seq data submission portal. To submit
        your virus sequences, please request an invite and login
        to your account to upload your data.
      </p>
      <div className={styles.mainAction}>
        <Link to='/login' className={styles.link}>
          <Button size='huge' primary>
            LOG IN YOUR ACCOUNT
          </Button>
        </Link>
      </div>
    </div>
  );
}
