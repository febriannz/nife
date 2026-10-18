import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_RANGES } from '../lib/constants'
import { formatCompactIDR, formatIDR, formatPct } from '../lib/format'

/** Titik aktif bercahaya (glowing pink/white dot) persis gaya referensi. */
function ActiveDot({ cx, cy }) {
  if (cx == null || cy == null) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill="#E3B9D8" opacity={0.18} />
      <circle cx={cx} cy={cy} r={6.5} fill="#E3B9D8" opacity={0.35} />
      <circle cx={cx} cy={cy} r={3.5} fill="#FFFFFF" stroke="#E3B9D8" strokeWidth={1.5} />
    </g>
  )
}

/** Kartu tooltip melayang: tanggal, nominal tebal, badge persentase. */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  const delta = point?.delta

  return (
    <div className="animate-fade-in min-w-[170px] rounded-xl border border-[#332938] bg-[#1C161F] p-3 shadow-2xl">
      <p className="text-[10.5px] text-[#7A7080]">{point.full}</p>
      <div className="mt-1.5 flex items-end justify-between gap-4">
        <p className="text-[13px] font-semibold text-[#F4EFF6]">{formatIDR(point.value)}</p>
        {delta != null && (
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              delta >= 0 ? 'bg-[#4E9F76]/15 text-[#4E9F76]' : 'bg-[#C95B68]/15 text-[#C95B68]'
            }`}
          >
            {delta >= 0 ? '+' : '-'}
            {formatPct(Math.abs(delta))}%
          </span>
        )}
      </div>
    </div>
  )
}

export default function CashFlowCard({ data, range, onRange, forwardedRef }) {
  const allZero = data.every((d) => d.value === 0)

  return (
    <section
      ref={forwardedRef}
      className="scroll-mt-6 rounded-[24px] border border-[#231D27] bg-[#0E0C10] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[13.5px] font-semibold text-[#F4EFF6]">Arus Kas Bulanan</h2>
        <div className="flex items-center gap-1.5">
          {CHART_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => onRange(r)}
              className={`rounded-full px-3 py-1.5 text-[10.5px] font-medium transition ${
                range === r
                  ? 'bg-[#8C6787] text-white shadow-[0_8px_20px_-8px_rgba(140,103,135,0.8)]'
                  : 'border border-[#26202B] text-[#7A7080] hover:text-[#F4EFF6]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 h-[250px]">
        {allZero && (
          <p className="absolute inset-0 z-10 grid place-items-center text-[11.5px] text-[#7A7080]">
            Belum ada arus kas pada periode ini
          </p>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="cashflow-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6E4868" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#6E4868" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#1C1720" strokeDasharray="2 6" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#7A7080', fontSize: 11 }}
              dy={8}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fill: '#7A7080', fontSize: 11 }}
              tickFormatter={(v) => formatCompactIDR(v, { withPrefix: false })}
            />
            <Tooltip
              cursor={{ stroke: '#C59BBF', strokeDasharray: '4 4', strokeOpacity: 0.45 }}
              content={<ChartTooltip />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#C59BBF"
              strokeWidth={2}
              fill="url(#cashflow-fill)"
              dot={false}
              activeDot={<ActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
