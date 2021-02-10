import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../../store/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const user = useSelector(s => s.auth.user);
  const isAdmin = user?.isAdmin
  const dispatch = useDispatch()

  return (
    <nav className={styles.navbar}>
      <ul className={styles.links}>
        <li>
          <Link to='/'>Home</Link>
        </li>
        <li>
          <Link to='/user/submit'>Submit Data</Link>
        </li>
        <li>
          <Link to='/user/sequences'>Past Submissions</Link>
        </li>
        {isAdmin &&
          <li>
            <Link to='/admin/users'>Users</Link>
          </li>
        }
      </ul>
      <div className={styles.user}>
        {user &&
          <>
            <Link to='/user/profile' className={styles.userName}>
              {user.firstName} {user.lastName}
            </Link>
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
