import { createSlice } from '@reduxjs/toolkit'
import errorToJSON from '../helpers/errorToJSON'
import api from '../api'

export const slice = createSlice({
  name: 'auth',
  initialState: {
    value: 0,
    isLoading: false,
    user: undefined,
    error: undefined,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
      state.error = undefined
    },
    setUser: (state, action) => {
      state.isLoading = false
      state.user = action.payload
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
});

export const { setIsLoading, setUser, setError } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const isLoggedIn = () => dispatch => {
  dispatch(setIsLoading(true))
  return api.auth.isLoggedIn()
  .then(user => dispatch(setUser(user)))
  .catch(error => dispatch(setError(errorToJSON(error))))
}

export const login = credentials => dispatch => {
  dispatch(setIsLoading(true))
  return api.auth.login(credentials)
  .then(user => dispatch(setUser(user)))
  .catch(error => dispatch(setError(errorToJSON(error))))
}

export const logout = () => dispatch => {
  dispatch(setIsLoading(true))
  return api.auth.logout()
  .then(() => dispatch(setUser(undefined)))
  .catch(error => dispatch(setError(errorToJSON(error))))
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectUser = state => state.auth.user;

export default slice.reducer;
