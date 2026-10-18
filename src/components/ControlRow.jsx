import { Mic, Plus, Search } from 'lucide-react'

export default function ControlRow({ search, onSearch, quickTab, onQuickTab, onAdd }) {
  const basePill = 'flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11.5px] font-medium transition'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            onQuickTab('Semua')
            onSearch('')
          }}
          className={`${basePill} ${
            quickTab === 'Semua'
              ? 'border-[#3A2F3E] bg-[#0E0C10] text-[#F4EFF6]'
              : 'border-[#231D27] bg-transparent text-[#7A7080] hover:text-[#F4EFF6]'
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => onQuickTab('Dompet')}
          className={`${basePill} ${
            quickTab === 'Dompet'
              ? 'border-transparent bg-gradient-to-b from-[#9E7698] to-[#593E55] text-white shadow-[0_10px_28px_-10px_rgba(158,118,152,0.75)]'
              : 'border-[#231D27] bg-transparent text-[#7A7080] hover:text-[#F4EFF6]'
          }`}
        >
          Dompet
        </button>

        <button
          onClick={onAdd}
          className={`${basePill} border-[#231D27] bg-transparent text-[#F4EFF6] hover:border-[#3A2F3E] hover:bg-[#0E0C10]`}
        >
          Tambah
          <Plus size={13} className="text-[#C89BBF]" />
        </button>
      </div>

      <div className="flex w-full max-w-[360px] items-center gap-2 rounded-full border border-[#231D27] bg-[#0E0C10] py-1 pl-4 pr-1.5">
        <Search size={15} className="shrink-0 text-[#7A7080]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Ask finance.ai anything..."
          className="w-full bg-transparent py-1.5 text-[12px] text-[#F4EFF6] placeholder:text-[#7A7080] focus:outline-none"
        />
        <button
          title="Pencarian suara (segera hadir)"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#7A7080] transition hover:bg-[#1D171F] hover:text-[#F4EFF6]"
        >
          <Mic size={14} />
        </button>
      </div>
    </div>
  )
}
