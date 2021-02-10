import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { logout } from '../../store/auth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const user = useSelector(s => s.auth.user);
  const isLoggedIn = Boolean(user)
  const isAdmin = user?.isAdmin
  const dispatch = useDispatch()

  return (
    <nav className={styles.navbar}>
      <div className={styles.links}>
        <NavbarLink to='/'>Home</NavbarLink>
        {isLoggedIn &&
          <>
            <NavbarLink to='/user/submit'>Submit Data</NavbarLink>
            <NavbarLink to='/user/sequences'>Past Submissions</NavbarLink>
          </>
        }
        {isAdmin &&
          <NavbarLink to='/admin/users'>Users</NavbarLink>
        }
        <div className={styles.separator} />
        {isLoggedIn &&
          <>
            <NavbarLink to='/user/profile'>
              {user.firstName} {user.lastName}
            </NavbarLink>
            <button onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        }
        {!isLoggedIn &&
          <NavbarLink to='/login'>Login</NavbarLink>
        }
      </div>
    </nav>
  )
}

function NavbarLink({ to, ...rest }) {
  const location = useLocation()
  const className =
    doesLocationMatch(location.pathname, to) ? styles.active : undefined
  return <Link to={to} className={className} {...rest} />
}

function doesLocationMatch(pathname, to) {
  if (to.length === 1)
    return to === pathname
  return pathname.startsWith(to)
}
