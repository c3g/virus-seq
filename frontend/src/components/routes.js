/*
 * routes.js
 */

import Login from './login/Login';
import SignUp from './signup/SignUp';
import Users from './users/Users';

const byName = {
  afterLogin: '/user/profile',
  afterSignUp: '/user/profile',
}

const list = [
  {
    path: '/signup',
    render: () => <SignUp />,
  },
  {
    path: '/login',
    render: () => <Login />,
  },
  {
    path: '/forgot-password',
    render: () => 'Forgot',
  },
  {
    path: '/user/profile',
    render: () => 'Profile',
  },
  {
    path: '/user/submission',
    render: () => 'Submit',
  },
  {
    path: '/user/history',
    render: () => 'History',
  },
  {
    path: '/admin/users',
    render: () => <Users />,
  },
  {
    path: '/',
    render: () => 'Home',
  },
]

export default { list, byName }
