import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoaded: false,
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  width: 0,
  height: 0,
  gutter: 10,
}

export const windowSlice = createSlice({
  name: 'window',
  initialState,
  reducers: {
    updateWindowSize: (state, { payload }) => {
      state.isLoaded = payload.innerWidth ? true : false
      state.height = payload.innerHeight
      state.width = payload.innerWidth
      state.isMobile = payload.innerWidth <= 767
      state.isTablet = payload.innerWidth > 767 && payload.innerWidth <= 1366
      state.isDesktop = payload.innerWidth > 1366
    },
  },
})

export const { updateWindowSize } = windowSlice.actions
