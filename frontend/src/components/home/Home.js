import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store/auth'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div>
      <h1>VIRUS-SEQ PORTAL</h1>
      <p className={styles.subtitle}>
        Welcome to the virus-seq data submission portal. To submit
        your virus sequences, please request an invite and login
        to your account to upload your data.
      </p>
      <div className={styles.mainAction}>
        <Link to='/login'>Login</Link>
      </div>
    </div>
  );
}
