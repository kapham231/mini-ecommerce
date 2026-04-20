export type ToyAccent = 'mint' | 'pink'

export type ToyCategory = {
  id: string
  title: string
  imageSrc: string
  description: string
}

export type SpotlightItem = {
  id: string
  title: string
  description: string
  imageSrc: string
  href: string
}

export type CatalogProduct = {
  id: string
  name: string
  priceLabel: string
  imageSrc: string
  rating: number
}

export type HomeArticle = {
  id: string
  title: string
  excerpt: string
  imageSrc: string
  href: string
  ctaLabel: string
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  initial: string
}

export const toyCategories: ToyCategory[] = [
  {
    id: 'plush',
    title: 'Thú bông',
    imageSrc: '/icons/Teddy Bear.png',
    description: 'Ôm êm, an toàn cho bé',
  },
  {
    id: 'cars',
    title: 'Xe & tàu',
    imageSrc: '/icons/Toy Car.png',
    description: 'Chạy vèo vèo trong nhà',
  },
  {
    id: 'dolls',
    title: 'Búp bê',
    imageSrc: '/icons/doll.png',
    description: 'Bạn đồng hành dễ thương',
  },
  {
    id: 'blocks',
    title: 'Xếp hình',
    imageSrc: '/icons/Brick.png',
    description: 'Sáng tạo không giới hạn',
  },
  {
    id: 'outdoor',
    title: 'Vận động',
    imageSrc: '/icons/Rocking Horse.png',
    description: 'Chơi ngoài trời vui khỏe',
  },
  {
    id: 'creative',
    title: 'Sáng tạo',
    imageSrc: '/icons/Playsets.png',
    description: 'Tô màu & thủ công',
  },
]

export const spotlightShowcase: SpotlightItem[] = [
  {
    id: 's1',
    title: 'Khám phá & tìm món yêu thích',
    description:
      'Bộ sưu tập thú bông mềm mịn, an toàn cho làn da nhạy cảm — chọn size và màu phù hợp phòng bé.',
    imageSrc: '/products/image1.png',
    href: '#products',
  },
  {
    id: 's2',
    title: 'Quà tặng trọn niềm vui',
    description:
      'Gói quà xinh, thiệp chúc mừng — gửi trực tiếp đến tay người nhận với lời nhắn của bạn.',
    imageSrc: '/products/image5.png',
    href: '#products',
  },
  {
    id: 's3',
    title: 'Mới về mỗi tuần',
    description:
      'Cập nhật mẫu limited theo mùa: pastel xuân hè, tone ấm thu đông — đừng bỏ lỡ những món hiếm.',
    imageSrc: '/products/image8.png',
    href: '#products',
  },
]

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'p1',
    name: 'Gấu bông cổ điển',
    priceLabel: '189.000 ₫',
    imageSrc: '/products/image1.png',
    rating: 5,
  },
  {
    id: 'p2',
    name: 'Thỏ bông tai dài',
    priceLabel: '219.000 ₫',
    imageSrc: '/products/image6.png',
    rating: 5,
  },
  {
    id: 'p3',
    name: 'Cún con nhồi bông',
    priceLabel: '165.000 ₫',
    imageSrc: '/products/image7.png',
    rating: 4,
  },
  {
    id: 'p4',
    name: 'Gấu tuyết ôm tim',
    priceLabel: '249.000 ₫',
    imageSrc: '/products/image9.png',
    rating: 5,
  },
]

export const homeArticles: {
  featured: HomeArticle
  secondary: HomeArticle[]
} = {
  featured: {
    id: 'a1',
    title: 'Thẻ quà tặng Kidozone',
    excerpt:
      'Trao quyền chọn cho người thân — dùng online, không hết hạn nhanh, phù hợp mọi dịp sinh nhật hay đầy tháng.',
    imageSrc: '/products/image10.png',
    href: '#',
    ctaLabel: 'Tìm hiểu thêm',
  },
  secondary: [
    {
      id: 'a2',
      title: 'Ưu đãi tuần này',
      excerpt: 'Giảm đến 20% cho nhóm thú bông size M — áp dụng đến hết Chủ nhật.',
      imageSrc: '/products/image11.png',
      href: '#',
      ctaLabel: 'Xem ưu đãi',
    },
    {
      id: 'a3',
      title: 'Cá nhân hóa thêu tên',
      excerpt: 'Thêu tên bé hoặc icon nhỏ trên tai gấu — chỉ thêm 2–3 ngày xử lý.',
      imageSrc: '/products/image12.png',
      href: '#',
      ctaLabel: 'Đặt thêu',
    },
  ],
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Đóng gói cẩn thận, gấu mềm đúng như ảnh. Bé ôm đi ngủ luôn từ hôm nhận hàng.',
    name: 'Lan Anh',
    role: 'TP. Hồ Chí Minh',
    initial: 'L',
  },
  {
    id: 't2',
    quote:
      'Mua làm quà sinh nhật cháu, hotline tư vấn nhiệt tình. Sẽ quay lại dịp Trung thu.',
    name: 'Minh Tuấn',
    role: 'Hà Nội',
    initial: 'M',
  },
  {
    id: 't3',
    quote:
      'Giao nhanh, chất liệu an toàn — mình đã soi kỹ tem và đường chỉ, rất ổn.',
    name: 'Thu Hà',
    role: 'Đà Nẵng',
    initial: 'T',
  },
]
