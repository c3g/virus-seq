/*
 * routes.js
 */

import Login from './login/Login';
import SignUp from './signup/SignUp';
import Users from './users/Users';

const byName = {
  login: '/login',
  profile: '/user/profile',
  afterLogin: '/user/profile',
  afterSignUp: '/user/profile',
}

const list = [
  {
    path: '/signup',
    render: () => <SignUp />,
  },
  {
    path: byName.login,
    render: () => <Login />,
  },
  {
    path: '/forgot-password',
    render: () => 'Forgot',
  },
  {
    path: byName.profile,
    render: () => 'Profile',
    login: true
  },
  {
    path: '/user/submission',
    render: () => 'Submit',
    login: true
  },
  {
    path: '/user/history',
    render: () => 'History',
    login: true
  },
  {
    path: '/admin/users',
    render: () => <Users />,
    admin: true
  },
  {
    path: '/',
    render: () => 'Home',
  },
]

export default { list, byName }
