import type { CartItem } from '~/features/cart/cartSlice'

const STORAGE_CART_KEY = 'cartItems'

export function saveCartToStorage(items: CartItem[]) {
  localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(items))
}

export function readCartFromStorage(): CartItem[] {
  const raw = localStorage.getItem(STORAGE_CART_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        typeof item?.id === 'number' &&
        typeof item?.name === 'string' &&
        typeof item?.imageUrl === 'string' &&
        typeof item?.unitPrice === 'string' &&
        typeof item?.quantity === 'number'
    )
  } catch {
    return []
  }
}
