import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, WALLETS } from '../lib/constants'

const numberID = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

const inputClass =
  'w-full rounded-xl border border-[#26202B] bg-[#0E0C10] px-3.5 py-2.5 text-[12.5px] text-[#F4EFF6] placeholder:text-[#7A7080] outline-none transition focus:border-[#6E4D69]'

const labelClass = 'mb-2 block text-[10.5px] font-medium uppercase tracking-wider text-[#7A7080]'

export default function AddTransactionModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('') // digit string
  const [category, setCategory] = useState('Makan')
  const [wallet, setWallet] = useState('Cash')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Kategori menyesuaikan tipe (Gaji untuk pemasukan, 4 kategori untuk pengeluaran)
  useEffect(() => {
    setCategory((prev) => (categories.includes(prev) ? prev : categories[0]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (open) {
      setError('')
      setBusy(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const numeric = Number(amount)
    if (!title.trim()) return setError('Nama transaksi wajib diisi.')
    if (!numeric || numeric <= 0) return setError('Nominal harus lebih dari 0.')

    setBusy(true)
    setError('')
    try {
      await onSubmit({ title: title.trim(), amount: numeric, type, category, wallet })
      setTitle('')
      setAmount('')
      setType('expense')
      setCategory('Makan')
      setWallet('Cash')
      onClose()
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan transaksi.')
    } finally {
      setBusy(false)
    }
  }

  const chip = (selected) =>
    `rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
      selected
        ? 'border-[#6E4D69] bg-[#6E4D69]/25 text-[#F4EFF6]'
        : 'border-[#26202B] text-[#7A7080] hover:text-[#F4EFF6]'
    }`

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-[6px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="animate-fade-pop w-full max-w-md rounded-[26px] border border-[#2E2532] bg-[#15111A]/95 p-6 shadow-[0_0_80px_rgba(169,124,158,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold text-[#F4EFF6]">Catat Transaksi</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#26202B] text-[#7A7080] transition hover:text-[#F4EFF6]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-full border border-[#26202B] bg-[#0E0C10] p-1">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`rounded-full py-2 text-[11.5px] font-medium transition ${
              type === 'income' ? 'bg-[#17251E] text-[#6FBF95]' : 'text-[#7A7080] hover:text-[#F4EFF6]'
            }`}
          >
            Pemasukan
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`rounded-full py-2 text-[11.5px] font-medium transition ${
              type === 'expense' ? 'bg-[#2A1A1E] text-[#E38B96]' : 'text-[#7A7080] hover:text-[#F4EFF6]'
            }`}
          >
            Pengeluaran
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <label className="block">
            <span className={labelClass}>Nama Transaksi</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth: Makan siang, Gaji bulanan..."
              className={inputClass}
              autoFocus
            />
          </label>

          <label className="block">
            <span className={labelClass}>Nominal</span>
            <div className="flex items-center rounded-xl border border-[#26202B] bg-[#0E0C10] px-3.5 transition focus-within:border-[#6E4D69]">
              <span className="text-[12px] text-[#7A7080]">Rp</span>
              <input
                inputMode="numeric"
                value={amount ? numberID.format(Number(amount)) : ''}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder="0"
                className="w-full bg-transparent px-2 py-2.5 text-[12.5px] text-[#F4EFF6] outline-none placeholder:text-[#7A7080]"
              />
            </div>
          </label>

          <div>
            <p className={labelClass}>Kategori</p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setCategory(c)} className={chip(category === c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={labelClass}>Dompet</p>
            <div className="flex flex-wrap gap-1.5">
              {WALLETS.map((w) => (
                <button key={w} type="button" onClick={() => setWallet(w)} className={chip(wallet === w)}>
                  {w}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[11px] text-[#C95B68]">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 w-full rounded-full bg-gradient-to-b from-[#9E7698] to-[#593E55] py-3 text-[12.5px] font-semibold text-white shadow-[0_14px_36px_-14px_rgba(158,118,152,0.9)] transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>
    </div>
  )
}
