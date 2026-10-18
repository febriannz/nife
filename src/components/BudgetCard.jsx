import { ArrowUpRight } from 'lucide-react'
import { CATEGORY_META } from '../lib/constants'
import { formatCompactIDR, formatPct } from '../lib/format'

export default function BudgetCard({ boxes, forwardedRef }) {
  return (
    <section
      ref={forwardedRef}
      className="flex h-full w-full scroll-mt-6 flex-col rounded-[24px] border border-[#231D27] bg-[#0E0C10] p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13.5px] font-semibold text-[#F4EFF6]">Alokasi Anggaran</h2>
        <div className="flex items-center gap-1.5">
          <button className="rounded-full border border-[#26202B] bg-[#161219] px-3.5 py-1.5 text-[10.5px] font-medium text-[#C8C2CC] transition hover:text-white">
            See all
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-full border border-[#26202B] bg-[#161219] text-[#C8C2CC] transition hover:text-white">
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-3">
        {boxes.map((b) => {
          const Icon = CATEGORY_META[b.category].icon
          const surplus = b.remainingPct >= 0
          return (
            <div
              key={b.category}
              className="flex flex-col justify-between rounded-2xl border border-[#26202B] bg-[#161219] p-3.5"
            >
              <div>
                <p className="text-[14.5px] font-semibold text-[#F4EFF6]">{formatCompactIDR(b.spent)}</p>
                <p
                  className={`mt-1 text-[10.5px] font-medium ${
                    surplus ? 'text-[#4E9F76]' : 'text-[#C95B68]'
                  }`}
                >
                  {surplus ? '+' : '-'}
                  {formatPct(Math.abs(b.remainingPct))}% {surplus ? 'sisa' : 'lebih'}
                </p>
              </div>

              <div className="mt-4 flex items-end justify-between gap-2">
                <Icon size={16} className="shrink-0 text-[#4A424E]" />
                <p className="truncate text-[10px] text-[#7A7080]">
                  {b.category} • {b.count}x
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
