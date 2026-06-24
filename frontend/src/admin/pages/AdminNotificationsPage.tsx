import { useNavigate, useSearchParams } from 'react-router-dom'
import { AdminPagination } from '~/admin/components/AdminActionBits'
import { AdminListMeta, AdminListPanel } from '~/admin/components/AdminListBits'
import { AdminFilterBar, AdminFilterSelect } from '~/admin/components/AdminFilterBar'
import { AdminLayout } from '~/admin/components/AdminLayout'
import type { NotificationType } from '~/lib/api/types'

const notificationTypeOptions: { value: '' | NotificationType; label: string }[] = [
  { value: '', label: 'Tất cả loại' },
  { value: 'SYSTEM', label: 'Hệ thống' },
  { value: 'VENDOR_REQUEST', label: 'Yêu cầu vendor' },
  { value: 'VENDOR_PRODUCT_REVIEW', label: 'Duyệt sản phẩm' },
  { value: 'VENDOR_WITHDRAWAL', label: 'Rút tiền vendor' },
  { value: 'NEW_PRODUCT', label: 'Sản phẩm mới' },
  { value: 'PRODUCT_PROMOTION', label: 'Khuyến mãi' },
  { value: 'ORDER_STATUS', label: 'Đơn hàng' },
]

export function AdminNotificationsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const readFilter = searchParams.get('isRead') ?? ''
  const typeFilter = (searchParams.get('type') ?? '') as '' | NotificationType

  function updateFilters(next: { isRead?: string; type?: string; page?: number }) {
    const params = new URLSearchParams(searchParams)

    if (next.isRead !== undefined) {
      if (next.isRead) params.set('isRead', next.isRead)
      else params.delete('isRead')
    }

    if (next.type !== undefined) {
      if (next.type) params.set('type', next.type)
      else params.delete('type')
    }

    if (next.page !== undefined) {
      if (next.page > 1) params.set('page', String(next.page))
      else params.delete('page')
    }

    setSearchParams(params)
  }

  return (
    <AdminLayout
      title='Thông báo'
      description='Theo dõi và xử lý thông báo hệ thống, đơn hàng, vendor và sản phẩm.'
      actions={
        <>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            Quay lại
          </button>
          <button
            type='button'
            disabled
            className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-5 text-sm font-bold text-white opacity-60'
          >
            Đánh dấu tất cả đã đọc
          </button>
        </>
      }
    >
      <AdminFilterBar
        gridClassName='md:grid-cols-[220px_260px_auto]'
        onClear={() => setSearchParams(new URLSearchParams())}
      >
        <AdminFilterSelect
          label='Trạng thái'
          value={readFilter}
          onChange={(value) => updateFilters({ isRead: value, page: 1 })}
          options={[
            { value: '', label: 'Tất cả' },
            { value: 'false', label: 'Chưa đọc' },
            { value: 'true', label: 'Đã đọc' },
          ]}
        />
        <AdminFilterSelect
          label='Loại thông báo'
          value={typeFilter}
          onChange={(value) => updateFilters({ type: value, page: 1 })}
          options={notificationTypeOptions}
        />
      </AdminFilterBar>

      <AdminListMeta
        isLoading={false}
        summary='Hiển thị 0 / 0 thông báo'
        trailing={<p>Trang 1 / 1</p>}
      />

      <AdminListPanel message='Chưa có thông báo nào.' />

      <AdminPagination page={page} totalPages={1} onPageChange={(nextPage) => updateFilters({ page: nextPage })} />
    </AdminLayout>
  )
}
