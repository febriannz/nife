import { useEffect } from 'react'
import { X } from 'lucide-react'
import TransactionRow from './TransactionRow'

/** Modal "Selengkapnya" — daftar lengkap transaksi dengan scroll internal. */
export default function AllTransactionsModal({ open, onClose, rows, onDelete }) {
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
      <div className="animate-fade-pop flex max-h-[85vh] w-full max-w-lg flex-col rounded-[26px] border border-[#2E2532] bg-[#15111A]/95 p-6 shadow-[0_0_80px_rgba(169,124,158,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[15px] font-semibold text-[#F4EFF6]">Semua Transaksi</h3>
            <span className="rounded-full border border-[#26202B] bg-[#161219] px-2.5 py-0.5 text-[10px] text-[#7A7080]">
              {rows.length} transaksi
            </span>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#26202B] text-[#7A7080] transition hover:text-[#F4EFF6]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          {rows.length === 0 ? (
            <p className="grid min-h-[160px] place-items-center text-center text-[11.5px] text-[#7A7080]">
              Tidak ada transaksi.
            </p>
          ) : (
            <ul className="divide-y divide-[#1C1720]">
              {rows.map((r) => (
                <TransactionRow key={r.id} transaction={r} onDelete={onDelete} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
