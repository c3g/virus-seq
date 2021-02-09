/*
 * routes.js
 */

import { Redirect } from 'react-router-dom'

import { USER_TYPE } from '../constants'

import Forgot from './forgot/Forgot'
import Home from './home/Home'
import Login from './login/Login'
import Profile from './profile/Profile'
import Sequences from './sequences/Sequences'
import SignUp from './signup/SignUp'
import Submit from './submit/Submit'
import Users from './users/Users'

const byName = {
  login: '/login',
  forgot: '/forgot-password',
  profile: '/user/profile',
  afterLogin: '/user/profile',
  afterSignUp: '/user/profile',
}

const login = u => u ? null : <Redirect to={byName.login} />
const admin = u => u?.type === USER_TYPE.ADMIN ? null : <Redirect to={byName.login} />
const notLogin = u => !u ? null : <Redirect to={byName.profile} />

const list = [
  {
    path: '/signup',
    render: () => <SignUp />,
    if: notLogin,
  },
  {
    path: byName.login,
    render: () => <Login />,
    if: notLogin,
  },
  {
    path: byName.forgot,
    render: () => <Forgot />,
    if: notLogin,
  },
  {
    path: byName.profile,
    render: () => <Profile />,
    if: login,
  },
  {
    path: '/user/submit',
    render: () => <Submit />,
    if: login,
  },
  {
    path: '/user/sequences',
    render: () => <Sequences />,
    if: login,
  },
  {
    path: '/admin/users',
    render: () => <Users />,
    if: admin,
  },
  {
    path: '/',
    render: () => <Home />,
  },
]

export default { list, byName }
