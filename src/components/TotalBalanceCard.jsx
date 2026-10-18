import { ChevronDown } from 'lucide-react'
import { formatIDR } from '../lib/format'

export default function TotalBalanceCard({ balance, forwardedRef }) {
  return (
    <section
      ref={forwardedRef}
      className="relative scroll-mt-6 overflow-hidden rounded-[24px] border border-[#231D27] bg-[#0E0C10] p-5"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11.5px] font-medium text-[#7A7080]">Total Saldo</span>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full border border-[#26202B] bg-[#161219] px-3 py-1 text-[10.5px] font-medium text-[#C8C2CC]">
            6M
          </span>
          <button className="grid h-7 w-7 place-items-center rounded-full border border-[#26202B] bg-[#161219] text-[#7A7080] transition hover:text-[#F4EFF6]">
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <p className="mt-7 text-[30px] font-semibold tracking-tight text-[#F4EFF6] md:text-[32px]">
        {formatIDR(balance)}
      </p>
      <p className="mt-1.5 text-[10.5px] text-[#7A7080]">Gabungan semua dompet • Cash, Bank &amp; E-Wallet</p>

      {/* Radial glow khas referensi di sudut kanan bawah */}
      <div className="pointer-events-none absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-[#A97C9E] opacity-30 blur-3xl" />
    </section>
  )
}
