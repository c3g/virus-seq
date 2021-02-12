import { createSlice } from '@reduxjs/toolkit'
import { indexBy, prop } from 'rambda'
import errorToJSON from '../helpers/errorToJSON'
import api from '../api'

export const slice = createSlice({
  name: 'upload',
  initialState: {
    isLoading: false,
    isLoaded: false,
    list: [],
    byId: {},
    error: undefined,
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
      state.error = undefined
    },
    setList: (state, action) => {
      state.isLoading = false
      state.isLoaded = true
      state.list = action.payload
      state.byId = indexBy(prop('id'), state.list)
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    addItems: (state, action) => {
      state.list = state.list.concat(action.payload)
      state.byId = indexBy(prop('id'), state.list)
    }
  },
});

export const { setIsLoading, setList, setError, addItems } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const list = () => dispatch => {
//   dispatch(setIsLoading(true))
//   return api.upload.list()
//   .then(uploads => dispatch(setList(uploads)))
//   .catch(error => dispatch(setError(errorToJSON(error))))
// }

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectSequence = state => state.auth.upload;

export default slice.reducer;
