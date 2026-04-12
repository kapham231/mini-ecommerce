import type { CatalogProduct } from '~/data/homeShowcase'
import type { CategorySummary } from '~/types/category'
import type { ProductSummary } from '~/types/product'

const homeCategory: CategorySummary = { id: 0, name: 'Bán chạy', slug: 'ban-chay' }

function digitsFromPriceLabel(label: string): string {
  const d = label.replace(/\D/g, '')
  return d || '0'
}

function numericId(id: string): number {
  const n = parseInt(id.replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? 1000 + n : id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
}

export function catalogProductToProductSummary(p: CatalogProduct): ProductSummary {
  const price = digitsFromPriceLabel(p.priceLabel)
  const original = String(Math.round(Number(price) * 1.28))
  return {
    id: numericId(p.id),
    name: p.name,
    slug: `home-${p.id}`,
    description: null,
    price,
    originalPrice: original,
    stock: 50,
    imageUrl: p.imageSrc,
    categoryId: homeCategory.id,
    category: homeCategory,
    sku: p.id.replace(/^p/i, 'KC-').toUpperCase(),
    rating: p.rating,
  }
}
