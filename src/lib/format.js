const numberID = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

/** Rp 12.304.110 */
export function formatIDR(value) {
  const n = Number(value) || 0
  const sign = n < 0 ? '-' : ''
  return `${sign}Rp ${numberID.format(Math.abs(n))}`
}

function trimNumber(n) {
  const fixed = n < 10 ? n.toFixed(2) : n.toFixed(1)
  const trimmed = fixed.includes('.') ? fixed.replace(/0+$/, '').replace(/\.$/, '') : fixed
  return trimmed.replace('.', ',')
}

/** Rp 1,72jt / Rp 486rb / Rp 8,75jt */
export function formatCompactIDR(value, { withPrefix = true } = {}) {
  const raw = Number(value) || 0
  const n = Math.abs(raw)
  const sign = raw < 0 ? '-' : ''
  const prefix = withPrefix ? 'Rp ' : ''
  if (n >= 1_000_000_000) return `${sign}${prefix}${trimNumber(n / 1_000_000_000)}M`
  if (n >= 1_000_000) return `${sign}${prefix}${trimNumber(n / 1_000_000)}jt`
  if (n >= 1_000) return `${sign}${prefix}${trimNumber(n / 1_000)}rb`
  return `${sign}${prefix}${numberID.format(n)}`
}

/** +Rp 8.750.000 (income) / -Rp 45.000 (expense) */
export function formatSignedIDR(value, type) {
  const prefix = type === 'income' ? '+' : '-'
  return `${prefix}${formatIDR(Math.abs(Number(value) || 0))}`
}

/** 17,4 (desimal koma ala Indonesia) */
export function formatPct(value, digits = 1) {
  const n = Number(value) || 0
  return n.toFixed(digits).replace('.', ',')
}

/** Hari ini / Kemarin / 3 hari lalu / 12 Jun */
export function relativeTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((startOfToday.getTime() - startOfTarget.getTime()) / 86_400_000)
  if (diffDays <= 0) return 'Hari ini'
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date)
}

/** 18 Okt 2026 */
export function shortDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}
