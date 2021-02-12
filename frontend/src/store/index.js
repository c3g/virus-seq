import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import auth, { isLoggedIn } from './auth'
import sequence from './sequence'
import upload from './upload'
import user from './user'

// TODO: implement this
// const serializedState = localStorage.getItem('state')
const serializedState = undefined
const preloadedState = serializedState ? JSON.parse(serializedState) : undefined

const store = configureStore({
  preloadedState,
  reducer: {
    auth,
    sequence,
    upload,
    user,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

store.dispatch(isLoggedIn())

// TODO: implement this
// window.addEventListener('unload', () => {})

export default store
