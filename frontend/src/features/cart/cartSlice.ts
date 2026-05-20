import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CartItem = {
  id: number
  name: string
  imageUrl: string
  unitPrice: string
  quantity: number
}

export type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: []
}

type AddItemPayload = {
  id: number
  name: string
  imageUrl: string
  unitPrice: string
  quantity?: number
}

type SetQtyPayload = {
  id: number
  quantity: number
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<AddItemPayload>) => {
      const qty = action.payload.quantity ?? 1
      const existing = state.items.find((item) => item.id === action.payload.id)
      if (existing) {
        existing.quantity += qty
        return
      }
      state.items.push({
        id: action.payload.id,
        name: action.payload.name,
        imageUrl: action.payload.imageUrl,
        unitPrice: action.payload.unitPrice,
        quantity: qty
      })
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    increaseQty: (state, action: PayloadAction<number>) => {
      const item = state.items.find((it) => it.id === action.payload)
      if (item) item.quantity += 1
    },
    decreaseQty: (state, action: PayloadAction<number>) => {
      const item = state.items.find((it) => it.id === action.payload)
      if (!item) return
      item.quantity = Math.max(1, item.quantity - 1)
    },
    setQty: (state, action: PayloadAction<SetQtyPayload>) => {
      const item = state.items.find((it) => it.id === action.payload.id)
      if (!item) return
      item.quantity = Math.max(1, action.payload.quantity)
    },
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { setCartItems, addItem, removeItem, increaseQty, decreaseQty, setQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
