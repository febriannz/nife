import {
  BarChart3,
  Database,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  PieChart,
  Settings,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import LogoMark from './LogoMark'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Dompet & Saldo', icon: Wallet },
  { label: 'Analisis', icon: BarChart3 },
  { label: 'Transaksi', icon: TrendingUp },
  { label: 'Anggaran', icon: PieChart },
]

function NavButton({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-full px-4 py-2.5 text-left text-[12.5px] font-medium transition ${
        active
          ? 'bg-gradient-to-r from-[#6E4D69]/80 via-[#483246]/50 to-transparent text-[#F4EFF6] shadow-[0_10px_30px_-14px_rgba(110,77,105,0.9)]'
          : 'text-[#7A7080] hover:bg-white/[0.03] hover:text-[#F4EFF6]'
      }`}
    >
      <Icon
        size={16}
        className={active ? 'text-[#C89BBF]' : 'text-[#7A7080] transition group-hover:text-[#C89BBF]'}
      />
      {label}
    </button>
  )
}

export default function Sidebar({ active, onNavigate, onSettings, onSupport, onLogout, isDemo }) {
  const bottomItem =
    'flex items-center gap-3 rounded-full px-4 py-2.5 text-left text-[12.5px] font-medium text-[#7A7080] transition hover:bg-white/[0.03] hover:text-[#F4EFF6]'

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col justify-between rounded-[24px] border border-[#231D27] bg-[#0E0C10] p-5 lg:flex">
      <div>
        <div className="flex items-center gap-2.5 px-1">
          <LogoMark className="h-5 w-5 text-[#F4EFF6]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#F4EFF6]">Nife Finance</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ label, icon }) => (
            <NavButton
              key={label}
              label={label}
              icon={icon}
              active={active === label}
              onClick={() => onNavigate(label)}
            />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1.5">
        {isDemo && (
          <div className="mb-2 flex items-center gap-2 rounded-full border border-[#26202B] bg-[#161219] px-3.5 py-2 text-[10.5px] text-[#7A7080]">
            <Database size={12} className="text-[#C89BBF]" />
            Mode Demo — data lokal
          </div>
        )}

        <button onClick={onSettings} className={bottomItem}>
          <Settings size={16} />
          Settings
        </button>
        <button onClick={onSupport} className={bottomItem}>
          <LifeBuoy size={16} />
          Support
        </button>
        {!isDemo && (
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-full px-4 py-2.5 text-left text-[12.5px] font-medium text-[#C95B68] transition hover:bg-[#C95B68]/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}
