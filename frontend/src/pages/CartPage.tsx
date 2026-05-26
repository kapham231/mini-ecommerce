import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { PopupCheckout } from '~/components/checkout/PopupCheckout'
import { Modal } from '~/components/layout/Modal'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { decreaseQty, increaseQty, removeItem, setQty } from '~/features/cart/cartSlice'
import { formatVndFromDecimal } from '~/lib/formatPrice'

const shippingFee = 30000

export function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.cart.items)
  const [isPopupCheckoutOpen, setIsPopupCheckoutOpen] = useState(false)
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0),
    [items]
  )

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const total = items.length === 0 ? 0 : subtotal + shippingFee

  return (
    <div className='min-h-screen bg-shop-blue'>
      <SiteHeader />

      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>
        <div className='mb-7 flex items-end justify-between gap-2'>
          <div>
            <h1 className='text-xl font-extrabold text-shop-ink sm:text-3xl'>Giỏ hàng của bạn</h1>
            <p className='mt-3 text-sm text-shop-ink/65'>{totalItems} sản phẩm trong giỏ</p>
          </div>
          <Link to='/products' className='text-sm font-semibold text-kid-green hover:underline'>
            + Thêm sản phẩm
          </Link>
        </div>

        {items.length === 0 ? (
          <section className='rounded-2xl bg-white p-8 text-center shadow-sm'>
            <h2 className='text-xl font-bold text-shop-ink'>Giỏ hàng đang trống</h2>
            <p className='mt-2 text-sm text-shop-ink/65'>Khám phá thêm đồ chơi để thêm vào giỏ nhé.</p>
            <Link
              to='/products'
              className='mt-5 inline-flex rounded-xl bg-kid-green px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95'
            >
              Mua sắm ngay
            </Link>
          </section>
        ) : (
          <div className='grid gap-6 lg:grid-cols-[1fr_320px]'>
            <section className='space-y-4'>
              {items.map((item) => {
                const linePrice = Number(item.unitPrice) * item.quantity
                return (
                  <article
                    key={item.id}
                    className='grid grid-cols-[88px_1fr] gap-4 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[110px_1fr]'
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className='h-22 w-22 rounded-lg object-cover sm:h-24 sm:w-24'
                    />
                    <div className='flex flex-col gap-3'>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <h2 className='font-bold text-shop-ink'>{item.name}</h2>
                          <p className='text-sm text-shop-ink/60'>Đơn giá: {formatVndFromDecimal(item.unitPrice)}</p>
                        </div>
                        <button
                          type='button'
                            onClick={() => dispatch(removeItem(item.id))}
                          className='text-sm font-semibold text-red-500 hover:underline'
                        >
                          Xóa
                        </button>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div className='inline-flex items-center rounded-lg border border-shop-ink/15'>
                          <button
                            type='button'
                            onClick={() => dispatch(decreaseQty(item.id))}
                            className='px-1.5 py-1.5 text-lg text-shop-ink transition hover:bg-shop-blue'
                            aria-label='Giảm số lượng'
                          >
                            -
                          </button>
                          <input
                            type='number'
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const nextQty = Number(e.target.value)
                              if (!Number.isFinite(nextQty) || nextQty < 1) return
                              dispatch(setQty({ id: item.id, quantity: nextQty }))
                            }}
                            className='w-10 border-x border-shop-ink/15 bg-white text-center text-sm font-semibold text-shop-ink outline-none'
                            aria-label={`Số lượng của ${item.name}`}
                          />
                          <button
                            type='button'
                            onClick={() => dispatch(increaseQty(item.id))}
                            className='px-1.5 py-1.5 text-lg text-shop-ink transition hover:bg-shop-blue'
                            aria-label='Tăng số lượng'
                          >
                            +
                          </button>
                        </div>
                        <p className='font-extrabold text-shop-ink'>{formatVndFromDecimal(String(linePrice))}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>

            <aside className='h-fit rounded-2xl bg-white p-5 shadow-sm'>
              <h2 className='text-lg font-extrabold text-shop-ink'>Tóm tắt đơn hàng</h2>
              <div className='mt-4 space-y-2 text-sm'>
                <div className='flex items-center justify-between text-shop-ink/75'>
                  <span>Tạm tính</span>
                  <span>{formatVndFromDecimal(String(subtotal))}</span>
                </div>
                <div className='flex items-center justify-between text-shop-ink/75'>
                  <span>Phí vận chuyển</span>
                  <span>{formatVndFromDecimal(String(items.length === 0 ? 0 : shippingFee))}</span>
                </div>
                <div className='my-2 border-t border-shop-ink/10' />
                <div className='flex items-center justify-between text-base font-extrabold text-shop-ink'>
                  <span>Tổng cộng</span>
                  <span>{formatVndFromDecimal(String(total))}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (items.length > 0) setIsPopupCheckoutOpen(true)
                }}
                type='button'
                className='mt-5 w-full rounded-xl bg-kid-green px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-95'
              >
                Tiến hành thanh toán
              </button>
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />

      <Modal isOpen={isPopupCheckoutOpen} onClose={() => setIsPopupCheckoutOpen(false)}>
        <PopupCheckout onClose={() => setIsPopupCheckoutOpen(false)} />
      </Modal>
    </div>
  )
}