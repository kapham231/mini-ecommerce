import { catalogProducts } from '~/data/homeShowcase'
import { shopProducts } from '~/data/shopCatalog'
import { catalogProductToProductSummary } from '~/lib/catalogProductToSummary'
import type { ProductSummary } from '~/types/product'

function buildProductByIdMap(): Map<number, ProductSummary> {
  const map = new Map<number, ProductSummary>()
  for (const product of shopProducts) {
    map.set(product.id, product)
  }
  for (const catalog of catalogProducts) {
    const product = catalogProductToProductSummary(catalog)
    if (!map.has(product.id)) {
      map.set(product.id, product)
    }
  }
  return map
}

const productById = buildProductByIdMap()

function buildProductBySlugMap(): Map<string, ProductSummary> {
  const map = new Map<string, ProductSummary>()
  for (const product of productById.values()) {
    map.set(product.slug, product)
  }
  return map
}

const productBySlug = buildProductBySlugMap()

export function getProductBySlug(slug: string): ProductSummary | undefined {
  return productBySlug.get(slug)
}

export function getAllProducts(): ProductSummary[] {
  return Array.from(productById.values())
}

export function resolveProductsByIds(ids: number[]): ProductSummary[] {
  return ids
    .map((id) => productById.get(id))
    .filter((product): product is ProductSummary => product !== undefined)
}
