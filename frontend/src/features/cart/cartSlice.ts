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

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
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
    clearCart: (state) => {
      state.items = []
    }
  }
})

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } = cartSlice.actions
export default cartSlice.reducer
