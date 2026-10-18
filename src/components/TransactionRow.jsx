import { Trash2, Wallet as WalletIcon } from 'lucide-react'
import { CATEGORY_META } from '../lib/constants'
import { formatSignedIDR, relativeTime } from '../lib/format'

/** Satu baris transaksi — dipakai di kartu Transaksi Terakhir & modal Selengkapnya. */
export default function TransactionRow({ transaction: r, onDelete }) {
  const Icon = CATEGORY_META[r.category]?.icon ?? WalletIcon
  const isIncome = r.type === 'income'

  return (
    <li className="group flex items-center gap-3 py-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#26202B] bg-[#161219] text-[#9B8FA4]">
        <Icon size={15} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-[#F4EFF6]">{r.title}</p>
        <p className="mt-0.5 text-[10.5px] text-[#7A7080]">
          {r.wallet} • {r.category}
        </p>
      </div>

      <div className="flex flex-col items-end">
        <p
          className={`whitespace-nowrap text-[12.5px] font-semibold ${
            isIncome ? 'text-[#4E9F76]' : 'text-[#C95B68]'
          }`}
        >
          {formatSignedIDR(r.amount, r.type)}
        </p>
        <p className="mt-0.5 text-[10px] text-[#7A7080]">{relativeTime(r.created_at)}</p>
      </div>

      <button
        onClick={() => onDelete(r.id)}
        title="Hapus transaksi"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#C95B68] opacity-0 transition hover:bg-[#C95B68]/10 focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>
    </li>
  )
}
