import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/features/auth/authSlice'
import cartReducer, { type CartState } from '~/features/cart/cartSlice'
import wishlistReducer, { type WishlistState } from '~/features/wishlist/wishlistSlice'
import type { AuthState } from '~/features/auth/authSlice'
import { readAuthFromStorage } from '~/lib/authStorage'
import { readCartFromStorage, saveCartToStorage } from '~/lib/cartStorage'
import { readWishlistFromStorage, saveWishlistToStorage } from '~/lib/wishlistStorage'

const preloaded = readAuthFromStorage()

const preloadedAuth: AuthState = preloaded
  ? {
      user: preloaded.user,
      token: preloaded.token,
      isAuthenticated: true
    }
  : {
      user: null,
      token: null,
      isAuthenticated: false
    }

const preloadedCart: CartState = {
  items: readCartFromStorage(preloadedAuth.user?.id)
}

const preloadedWishlist: WishlistState = {
  productIds: readWishlistFromStorage(preloadedAuth.user?.id)
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer
  },
  preloadedState: {
    auth: preloadedAuth,
    cart: preloadedCart,
    wishlist: preloadedWishlist
  }
})

store.subscribe(() => {
  const state = store.getState()
  if (!state.auth.isAuthenticated || !state.auth.user?.id) {
    return
  }
  saveCartToStorage(state.cart.items, state.auth.user.id)
  saveWishlistToStorage(state.wishlist.productIds, state.auth.user.id)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
