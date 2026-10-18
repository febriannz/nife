import { CATEGORY_META, EXPENSE_CATEGORIES } from './constants'

const num = (v) => Number(v) || 0

export function computeTotals(rows) {
  let income = 0
  let expense = 0
  for (const r of rows) {
    if (r.type === 'income') income += num(r.amount)
    else expense += num(r.amount)
  }
  return { income, expense, balance: income - expense }
}

const isSameMonth = (date, ref) =>
  date.getFullYear() === ref.getFullYear() && date.getMonth() === ref.getMonth()

export function computeMonthlyTotals(rows, ref = new Date()) {
  let income = 0
  let expense = 0
  for (const r of rows) {
    const d = new Date(r.created_at)
    if (!isSameMonth(d, ref)) continue
    if (r.type === 'income') income += num(r.amount)
    else expense += num(r.amount)
  }
  return { income, expense }
}

/** Grid 2x2 Alokasi Anggaran untuk bulan berjalan. */
export function computeBudgetBoxes(rows, ref = new Date()) {
  return EXPENSE_CATEGORIES.map((category) => {
    const monthRows = rows.filter(
      (r) =>
        r.type === 'expense' &&
        r.category === category &&
        isSameMonth(new Date(r.created_at), ref),
    )
    const spent = monthRows.reduce((acc, r) => acc + num(r.amount), 0)
    const budget = CATEGORY_META[category]?.budget ?? 0
    const remaining = budget - spent
    const remainingPct = budget > 0 ? (remaining / budget) * 100 : 0
    return { category, spent, budget, remainingPct, count: monthRows.length }
  })
}

/* ------------------------------------------------------------------ */
/* Grafik Arus Kas                                                     */
/* ------------------------------------------------------------------ */

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const monthShort = new Intl.DateTimeFormat('id-ID', { month: 'short' })
const weekdayShort = new Intl.DateTimeFormat('id-ID', { weekday: 'short' })
const fullDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const dayMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

const sumNet = (rows) =>
  rows.reduce((acc, r) => acc + (r.type === 'income' ? num(r.amount) : -num(r.amount)), 0)

function buildBuckets(range, now) {
  const today = startOfDay(now)
  const buckets = []

  if (range === '1D') {
    for (let h = 0; h < 24; h += 6) {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h)
      const end = new Date(start.getTime() + 6 * 3_600_000)
      const label = `${String(h).padStart(2, '0')}:00`
      buckets.push({ label, full: `Hari ini • ${label} – ${String((h + 6) % 24).padStart(2, '0')}:00`, start, end })
    }
    return buckets
  }

  if (range === '1W') {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
      const end = new Date(start.getTime() + 86_400_000)
      buckets.push({ label: weekdayShort.format(start), full: fullDate.format(start), start, end })
    }
    return buckets
  }

  if (range === '1M') {
    for (let w = 3; w >= 0; w--) {
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (w * 7 + 6))
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - w * 7 + 1)
      const endInclusive = new Date(end.getTime() - 86_400_000)
      buckets.push({
        label: dayMonth.format(start),
        full: `Minggu ${dayMonth.format(start)} – ${dayMonth.format(endInclusive)}`,
        start,
        end,
      })
    }
    return buckets
  }

  const monthsBack = range === '6M' ? 6 : 12
  for (let i = monthsBack - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    buckets.push({ label: monthShort.format(start), full: `${monthShort.format(start)} ${start.getFullYear()}`, start, end })
  }
  return buckets
}

/**
 * Titik grafik Arus Kas: value = pemasukan - pengeluaran per bucket,
 * plus delta persentase terhadap bucket sebelumnya untuk tooltip.
 */
export function buildChartData(rows, range, now = new Date()) {
  const buckets = buildBuckets(range, now)
  const points = buckets.map((b, index) => ({
    index,
    label: b.label,
    full: b.full,
    value: sumNet(
      rows.filter((r) => {
        const d = new Date(r.created_at)
        return d >= b.start && d < b.end
      }),
    ),
  }))

  return points.map((p, i) => {
    const prev = i > 0 ? points[i - 1].value : null
    const delta = prev !== null && prev !== 0 ? ((p.value - prev) / Math.abs(prev)) * 100 : null
    return { ...p, delta }
  })
}
