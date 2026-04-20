/** Giá từ API (chuỗi decimal) → hiển thị VN. */
export function formatVndFromDecimal(priceStr: string): string {
  const n = Number(priceStr)
  if (!Number.isFinite(n)) return priceStr
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(n))} ₫`
}
