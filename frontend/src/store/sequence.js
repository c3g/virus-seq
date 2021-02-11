import { createSlice } from '@reduxjs/toolkit'
import errorToJSON from '../helpers/errorToJSON'
import api from '../api'

export const slice = createSlice({
  name: 'sequence',
  initialState: {
    isLoading: false,
    isLoaded: false,
    list: [],
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
    },
    setError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
});

export const { setIsLoading, setList, setError } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const list = () => dispatch => {
  dispatch(setIsLoading(true))
  return api.sequence.list()
  .then(sequences => dispatch(setList(sequences)))
  .catch(error => dispatch(setError(errorToJSON(error))))
}

export const submit = (metadata, sequences) => (dispatch, getState) => {
  dispatch(setIsLoading(true))
  return api.sequence.submit(metadata, sequences)
  .then(sequences => {
    const previousSequences = getState().sequence.list
    const newSequences = previousSequences.concat(sequences)
    dispatch(setList(newSequences))
    return sequences
  })
  .catch(error => {
    dispatch(setError(errorToJSON(error)))
  })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
// export const selectSequence = state => state.auth.sequence;

export default slice.reducer;
