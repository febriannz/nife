import { ChevronDown } from 'lucide-react'
import TransactionRow from './TransactionRow'

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran']

/** Jumlah baris yang tampil di kartu; sisanya lewat tombol "Selengkapnya". */
const VISIBLE_COUNT = 4

function SkeletonRows() {
  return (
    <ul className="divide-y divide-[#1C1720]">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3 py-3.5">
          <span className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-[#161219]" />
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-28 animate-pulse rounded-full bg-[#1C1720]" />
            <div className="h-2 w-20 animate-pulse rounded-full bg-[#161219]" />
          </div>
          <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#1C1720]" />
        </li>
      ))}
    </ul>
  )
}

export default function TransactionsCard({
  rows,
  filter,
  onFilter,
  onDelete,
  onSeeAll,
  loading,
  isFallback,
  forwardedRef,
}) {
  const visibleRows = rows.slice(0, VISIBLE_COUNT)
  const hasMore = !loading && rows.length > VISIBLE_COUNT

  return (
    <section
      ref={forwardedRef}
      className="flex h-full w-full scroll-mt-6 flex-col rounded-[24px] border border-[#231D27] bg-[#0E0C10] p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13.5px] font-semibold text-[#F4EFF6]">Transaksi Terakhir</h2>
        {isFallback && (
          <span className="rounded-full border border-[#26202B] bg-[#161219] px-2.5 py-1 text-[10px] text-[#7A7080]">
            Data contoh
          </span>
        )}
      </div>

      <div className="mt-3.5 flex items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-medium transition ${
              filter === f
                ? 'bg-[#8C6787] text-white shadow-[0_8px_20px_-8px_rgba(140,103,135,0.8)]'
                : 'border border-[#26202B] text-[#7A7080] hover:text-[#F4EFF6]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-2 flex-1">
        {loading ? (
          <SkeletonRows />
        ) : rows.length === 0 ? (
          <p className="grid h-full min-h-[220px] place-items-center text-center text-[11.5px] text-[#7A7080]">
            Tidak ada transaksi yang cocok.
          </p>
        ) : (
          <ul className="divide-y divide-[#1C1720]">
            {visibleRows.map((r) => (
              <TransactionRow key={r.id} transaction={r} onDelete={onDelete} />
            ))}
          </ul>
        )}
      </div>

      {hasMore && (
        <button
          onClick={onSeeAll}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#26202B] py-2 text-[11px] font-medium text-[#7A7080] transition hover:border-[#3A2F3E] hover:text-[#F4EFF6]"
        >
          Selengkapnya ({rows.length})
          <ChevronDown size={12} />
        </button>
      )}
    </section>
  )
}
