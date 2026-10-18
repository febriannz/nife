import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function InfoModal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-[6px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="animate-fade-pop w-full max-w-sm rounded-[26px] border border-[#2E2532] bg-[#15111A]/95 p-6 shadow-[0_0_80px_rgba(169,124,158,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#F4EFF6]">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#26202B] text-[#7A7080] transition hover:text-[#F4EFF6]"
          >
            <X size={14} />
          </button>
        </div>
        <div className="mt-4 text-[12px] leading-relaxed text-[#B9B0C0]">{children}</div>
      </div>
    </div>
  )
}
