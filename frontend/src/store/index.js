import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import auth from './auth'

export default configureStore({
  reducer: {
    auth,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
});
