import { configureStore } from '@reduxjs/toolkit'
import { windowSlice } from './slices'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'

const reducer = combineReducers({
  window: windowSlice.reducer,
})

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})
