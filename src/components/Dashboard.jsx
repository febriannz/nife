import { useMemo, useRef, useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { isSupabaseConfigured } from '../lib/supabase'
import { buildChartData, computeBudgetBoxes, computeTotals } from '../lib/stats'
import AddTransactionModal from './AddTransactionModal'
import AllTransactionsModal from './AllTransactionsModal'
import BudgetCard from './BudgetCard'
import CashFlowCard from './CashFlowCard'
import ControlRow from './ControlRow'
import Header from './Header'
import InfoModal from './InfoModal'
import InsightsCard from './InsightsCard'
import Sidebar from './Sidebar'
import TotalBalanceCard from './TotalBalanceCard'
import TransactionsCard from './TransactionsCard'

export default function Dashboard({ user, onSignOut }) {
  const { rows, loading, isFallback, addTransaction, deleteTransaction } = useTransactions(user)

  const [search, setSearch] = useState('')
  const [quickTab, setQuickTab] = useState('Dompet')
  const [listFilter, setListFilter] = useState('Semua')
  const [range, setRange] = useState('6M')
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [addOpen, setAddOpen] = useState(false)
  const [allTransactionsOpen, setAllTransactionsOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  const balanceRef = useRef(null)
  const transactionsRef = useRef(null)
  const budgetRef = useRef(null)
  const chartRef = useRef(null)

  const totals = useMemo(() => computeTotals(rows), [rows])
  const budgets = useMemo(() => computeBudgetBoxes(rows), [rows])
  const chartData = useMemo(() => buildChartData(rows, range), [rows, range])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (listFilter === 'Pemasukan' && r.type !== 'income') return false
      if (listFilter === 'Pengeluaran' && r.type !== 'expense') return false
      if (!q) return true
      const haystack = [r.title, r.category, r.wallet, r.type === 'income' ? 'pemasukan' : 'pengeluaran']
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [rows, listFilter, search])

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna'
  const isDemoMode = !isSupabaseConfigured

  const handleNavigate = (label) => {
    setActiveNav(label)
    const targets = {
      Dashboard: null,
      'Dompet & Saldo': balanceRef,
      Analisis: chartRef,
      Transaksi: transactionsRef,
      Anggaran: budgetRef,
    }
    const target = targets[label]
    if (target?.current) {
      target.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="flex items-stretch gap-4">
        <Sidebar
          active={activeNav}
          onNavigate={handleNavigate}
          onSettings={() => setSettingsOpen(true)}
          onSupport={() => setSupportOpen(true)}
          onLogout={onSignOut}
          isDemo={isDemoMode}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <Header user={user} name={displayName} onOpenSettings={() => setSettingsOpen(true)} />

          <ControlRow
            search={search}
            onSearch={setSearch}
            quickTab={quickTab}
            onQuickTab={setQuickTab}
            onAdd={() => setAddOpen(true)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
            <div className="flex flex-col gap-4 md:col-span-2 xl:col-span-4">
              <TotalBalanceCard balance={totals.balance} forwardedRef={balanceRef} />
              <InsightsCard onAdd={() => setAddOpen(true)} />
            </div>

            <div className="flex md:col-span-1 xl:col-span-4">
              <TransactionsCard
                forwardedRef={transactionsRef}
                rows={filteredRows}
                filter={listFilter}
                onFilter={setListFilter}
                onDelete={deleteTransaction}
                onSeeAll={() => setAllTransactionsOpen(true)}
                loading={loading}
                isFallback={isFallback}
              />
            </div>

            <div className="flex md:col-span-1 xl:col-span-4">
              <BudgetCard forwardedRef={budgetRef} boxes={budgets} />
            </div>
          </div>

          <CashFlowCard forwardedRef={chartRef} data={chartData} range={range} onRange={setRange} />
        </div>
      </div>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addTransaction} />

      <AllTransactionsModal
        open={allTransactionsOpen}
        onClose={() => setAllTransactionsOpen(false)}
        rows={filteredRows}
        onDelete={deleteTransaction}
      />

      <InfoModal open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <ul className="space-y-2">
          <li>
            <span className="text-[#7A7080]">Profil:</span> {displayName} ({user?.email})
          </li>
          <li>
            <span className="text-[#7A7080]">Sumber data:</span>{' '}
            {isSupabaseConfigured ? 'Supabase (real-time)' : 'Mode Demo (lokal)'}
          </li>
          <li>
            <span className="text-[#7A7080]">Anggaran bulanan:</span> Makan Rp 2,5jt • Transport Rp 1,5jt •
            Kebutuhan Rp 3jt • Hiburan Rp 900rb
          </li>
        </ul>
      </InfoModal>

      <InfoModal open={supportOpen} onClose={() => setSupportOpen(false)} title="Support">
        <p>
          Butuh bantuan? Hubungi kami di{' '}
          <a href="mailto:support@nife.finance" className="text-[#C89BBF] underline-offset-2 hover:underline">
            support@nife.finance
          </a>
          .
        </p>
        <p className="mt-2 text-[#7A7080]">
          Harian kerja 09.00–17.00 WIB. Sertakan tangkapan layar bila melaporkan masalah.
        </p>
      </InfoModal>
    </>
  )
}
