type PopupCheckoutProps = {
  onClose: () => void
}

export function PopupCheckout({ onClose }: PopupCheckoutProps) {
  return (
    <div>
      <h1 className='text-2xl font-bold'>Thanh toán thành công</h1>
      <button
        type='button'
        className='mt-4 flex cursor-pointer items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white'
        onClick={onClose}
      >
        <span>Close</span>
      </button>
    </div>
  )
}