/*
 * routes.js
 */

import Login from './login/Login';

const byName = {
  afterLogin: '/user/profile',
}

const list = [
  {
    path: '/signup',
    render: () => 'Sign Up',
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
    render: () => 'Users',
  },
  {
    path: '/',
    render: () => 'Home',
  },
]

export default { list, byName }
