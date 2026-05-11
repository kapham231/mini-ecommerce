import type { CartItem } from '~/features/cart/cartSlice'

const STORAGE_CART_KEY = 'cartItems'

function getCartStorageKey(userId: string) {
  return `${STORAGE_CART_KEY}:${userId}`
}

function parseCartItems(raw: string | null): CartItem[] {
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

export function saveCartToStorage(items: CartItem[], userId: string | null | undefined) {
  if (!userId) return
  localStorage.setItem(getCartStorageKey(userId), JSON.stringify(items))
}

export function readCartFromStorage(userId: string | null | undefined): CartItem[] {
  if (!userId) return []

  const userCartKey = getCartStorageKey(userId)
  const userCart = parseCartItems(localStorage.getItem(userCartKey))
  if (userCart.length > 0) return userCart

  // Migrate legacy shared cart key once for existing users.
  const legacyCart = parseCartItems(localStorage.getItem(STORAGE_CART_KEY))
  if (legacyCart.length > 0) {
    localStorage.setItem(userCartKey, JSON.stringify(legacyCart))
    localStorage.removeItem(STORAGE_CART_KEY)
  }
  return legacyCart
}
