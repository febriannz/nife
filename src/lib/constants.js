import { Briefcase, CarFront, Gamepad2, ShoppingBasket, UtensilsCrossed } from 'lucide-react'

export const WALLETS = ['Cash', 'Rekening Bank', 'E-Wallet']

export const EXPENSE_CATEGORIES = ['Makan', 'Transport', 'Kebutuhan', 'Hiburan']
export const INCOME_CATEGORIES = ['Gaji']
export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

/** Ikon + kuota anggaran bulanan per kategori (untuk grid 2x2 Alokasi Anggaran). */
export const CATEGORY_META = {
  Makan: { icon: UtensilsCrossed, budget: 2_500_000 },
  Transport: { icon: CarFront, budget: 1_500_000 },
  Kebutuhan: { icon: ShoppingBasket, budget: 3_000_000 },
  Hiburan: { icon: Gamepad2, budget: 900_000 },
  Gaji: { icon: Briefcase, budget: 0 },
}

/** Kuota anggaran default per kategori — dipakai sampai user mengubahnya sendiri. */
export const DEFAULT_BUDGETS = Object.fromEntries(
  EXPENSE_CATEGORIES.map((c) => [c, CATEGORY_META[c].budget]),
)

export const CHART_RANGES = ['1D', '1W', '1M', '6M', '1Y']
