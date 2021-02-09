import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch()

  return (
    <nav className={styles.navbar}>
      <ul className={styles.links}>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/user/profile'>Profile</Link>
        </li>
        <li>
          <Link to='/admin/users'>Users</Link>
        </li>
      </ul>
      <div className={styles.user}>
        {user &&
          <>
            <span className={styles.userName}>
              {user.firstName} {user.lastName}
            </span>
            <button onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        }
        {!user &&
          <Link to='/login'>Login</Link>
        }
      </div>
    </nav>
  );
}
