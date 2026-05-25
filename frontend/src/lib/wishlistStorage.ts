const STORAGE_WISHLIST_KEY = 'wishlistProductIds'

function getWishlistStorageKey(userId: string) {
  return `${STORAGE_WISHLIST_KEY}:${userId}`
}

function parseWishlistIds(raw: string | null): number[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
  } catch {
    return []
  }
}

export function saveWishlistToStorage(productIds: number[], userId: string | null | undefined) {
  if (!userId) return
  localStorage.setItem(getWishlistStorageKey(userId), JSON.stringify(productIds))
}

export function readWishlistFromStorage(userId: string | null | undefined): number[] {
  if (!userId) return []
  return parseWishlistIds(localStorage.getItem(getWishlistStorageKey(userId)))
}
