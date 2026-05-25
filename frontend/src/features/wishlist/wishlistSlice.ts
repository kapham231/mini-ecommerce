import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type WishlistState = {
  productIds: number[]
}

const initialState: WishlistState = {
  productIds: []
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistIds: (state, action: PayloadAction<number[]>) => {
      state.productIds = action.payload
    },
    toggleWishlistItem: (state, action: PayloadAction<number>) => {
      const id = action.payload
      const index = state.productIds.indexOf(id)
      if (index >= 0) {
        state.productIds.splice(index, 1)
      } else {
        state.productIds.push(id)
      }
    },
    removeWishlistItem: (state, action: PayloadAction<number>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload)
    },
    clearWishlist: (state) => {
      state.productIds = []
    }
  }
})

export const { setWishlistIds, toggleWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
