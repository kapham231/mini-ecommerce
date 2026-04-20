import type { CategorySummary } from '~/types/category'
import type { ProductSummary } from '~/types/product'

export const shopCategories: CategorySummary[] = [
  { id: 1, name: 'Thú bông', slug: 'thu-bong' },
  { id: 2, name: 'Xe & tàu', slug: 'xe-tau' },
  { id: 3, name: 'Búp bê', slug: 'bup-be' },
  { id: 4, name: 'Xếp hình', slug: 'xep-hinh' },
]

export const shopProducts: ProductSummary[] = [
  {
    id: 101,
    name: 'Gấu bông mềm mịn',
    slug: 'gau-bong-mem-min',
    description: 'Chất liệu nhồi bông cao cấp, vỏ vải mềm — an toàn cho bé từ 0 tuổi.',
    price: '199000',
    originalPrice: '2225000',
    stock: 24,
    imageUrl: '/products/image1.png',
    categoryId: 1,
    category: shopCategories[0],
    sku: 'GZ-101',
    brand: 'Kidozone Plush',
  },
  {
    id: 102,
    name: 'Thỏ tai dài pastel',
    slug: 'tho-tai-dai-pastel',
    description: 'Tone màu pastel dịu mắt, dễ ôm khi ngủ.',
    price: '219000',
    originalPrice: '2900000',
    stock: 12,
    imageUrl: '/products/image6.png',
    categoryId: 1,
    category: shopCategories[0],
    sku: 'TH-102',
  },
  {
    id: 103,
    name: 'Xe đua nhỏ xinh',
    slug: 'xe-dua-nho-xinh',
    description: 'Bánh trơn, phù hợp chơi trong nhà.',
    price: '89000',
    originalPrice: '120000',
    stock: 40,
    imageUrl: '/products/image2.png',
    categoryId: 2,
    category: shopCategories[1],
    sku: 'XC-103',
  },
  {
    id: 104,
    name: 'Khối xếp màu sắc',
    slug: 'khoi-xep-mau-sac',
    description: '48 miếng, phát triển tư duy không gian.',
    price: '149000',
    originalPrice: '199000',
    stock: 18,
    imageUrl: '/products/image3.png',
    categoryId: 4,
    category: shopCategories[3],
    sku: 'LE-104',
    brand: 'Kidozone Creative',
  },
  {
    id: 105,
    name: 'Búp bê váy hồng',
    slug: 'bup-be-vay-hong',
    description: 'Vải cotton, có thể thay trang phục.',
    price: '259000',
    originalPrice: '345000',
    stock: 9,
    imageUrl: '/products/image4.png',
    categoryId: 3,
    category: shopCategories[2],
    sku: 'BB-105',
  },
  {
    id: 106,
    name: 'Cún con nhồi bông',
    slug: 'cun-con-nhoi-bong',
    description: 'Size vừa tay bé, mắt thêu an toàn.',
    price: '165000',
    originalPrice: '223000',
    stock: 30,
    imageUrl: '/products/image7.png',
    categoryId: 1,
    category: shopCategories[0],
    sku: 'GZ-106',
  },
]

export function getShopProductBySlug(slug: string): ProductSummary | undefined {
  return shopProducts.find((p) => p.slug === slug)
}

export function filterShopProducts(categorySlug: string | null): ProductSummary[] {
  if (!categorySlug) return shopProducts
  return shopProducts.filter((p) => p.category.slug === categorySlug)
}
