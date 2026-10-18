import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORY_META, DEFAULT_BUDGETS, EXPENSE_CATEGORIES } from '../lib/constants'
import { formatIDR } from '../lib/format'

const numberID = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

export default function BudgetModal({ open, onClose, budgets, onSave }) {
  const [values, setValues] = useState({}) // digit string per kategori

  // Isi ulang form dengan nilai aktif setiap kali modal dibuka
  useEffect(() => {
    if (!open) return
    const initial = {}
    for (const c of EXPENSE_CATEGORIES) {
      initial[c] = String(budgets?.[c] ?? DEFAULT_BUDGETS[c] ?? 0)
    }
    setValues(initial)
  }, [open, budgets])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSave = () => {
    const next = {}
    for (const c of EXPENSE_CATEGORIES) {
      next[c] = Math.max(0, Number(values[c]) || 0)
    }
    onSave(next)
    onClose()
  }

  const handleReset = () => {
    const next = {}
    for (const c of EXPENSE_CATEGORIES) {
      next[c] = String(DEFAULT_BUDGETS[c] ?? 0)
    }
    setValues(next)
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-[6px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="animate-fade-pop w-full max-w-md rounded-[26px] border border-[#2E2532] bg-[#15111A]/95 p-6 shadow-[0_0_80px_rgba(169,124,158,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#F4EFF6]">Atur Anggaran Bulanan</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#26202B] text-[#7A7080] transition hover:text-[#F4EFF6]"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-[#7A7080]">
          Kuota bulanan per kategori — indikator sisa/lebih di kartu mengikuti nilai ini.
        </p>

        <div className="mt-5 flex flex-col gap-2.5">
          {EXPENSE_CATEGORIES.map((c) => {
            const Icon = CATEGORY_META[c].icon
            return (
              <div
                key={c}
                className="flex items-center gap-3 rounded-2xl border border-[#26202B] bg-[#0E0C10] p-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#26202B] bg-[#161219] text-[#9B8FA4]">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-[#F4EFF6]">{c}</span>
                  <span className="block text-[10px] text-[#7A7080]">
                    Default: {formatIDR(DEFAULT_BUDGETS[c])}
                  </span>
                </span>
                <div className="flex items-center rounded-xl border border-[#26202B] bg-[#0E0C10] px-3 transition focus-within:border-[#6E4D69]">
                  <span className="text-[11px] text-[#7A7080]">Rp</span>
                  <input
                    inputMode="numeric"
                    value={values[c] ? numberID.format(Number(values[c])) : ''}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [c]: e.target.value.replace(/\D/g, '') }))
                    }
                    placeholder="0"
                    className="w-24 bg-transparent px-2 py-2 text-right text-[12.5px] text-[#F4EFF6] outline-none placeholder:text-[#7A7080]"
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={handleReset}
            className="rounded-full border border-[#26202B] px-4 py-2.5 text-[11.5px] font-medium text-[#7A7080] transition hover:border-[#3A2F3E] hover:text-[#F4EFF6]"
          >
            Reset ke Default
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-full bg-gradient-to-b from-[#9E7698] to-[#593E55] py-2.5 text-[12px] font-semibold text-white shadow-[0_14px_36px_-14px_rgba(158,118,152,0.9)] transition hover:brightness-110"
          >
            Simpan Anggaran
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-[#7A7080]">
          Tersimpan otomatis di perangkat ini, terpisah per akun.
        </p>
      </div>
    </div>
  )
}
