/**
 * Fallback dummy data — dipakai saat Supabase belum dikonfigurasi
 * atau tabel `transactions` masih kosong, agar grafik dan grid 2x2
 * tetap terlihat hidup seperti desain referensi.
 */
export function buildDummyTransactions(now = new Date()) {
  const rows = []
  const push = (date, title, amount, type, category, wallet) => {
    rows.push({
      id: `demo-${rows.length + 1}`,
      user_id: 'demo-user',
      title,
      amount,
      type,
      category,
      wallet,
      created_at: date.toISOString(),
      isDemo: true,
    })
  }
  const at = (y, m, d, h = 12) => new Date(y, m, d, h, 0, 0)

  const Y = now.getFullYear()
  const M = now.getMonth()

  // Riwayat 11 bulan sebelumnya (agregat bulanan agar kurva grafik berombak)
  for (let i = 11; i >= 1; i--) {
    const base = new Date(Y, M - i, 1)
    const y = base.getFullYear()
    const m = base.getMonth()
    const wave = (i * 7) % 4 // variasi 0..3

    push(at(y, m, 25, 9), 'Gaji Bulanan', 8_500_000 + wave * 250_000, 'income', 'Gaji', 'Rekening Bank')
    if (i % 3 === 0) {
      push(at(y, m, 18, 15), 'Bonus Proyek Freelance', 1_750_000, 'income', 'Gaji', 'Rekening Bank')
    }
    push(at(y, m, 6, 10), 'Belanja Kebutuhan Bulanan', 1_850_000 + wave * 120_000, 'expense', 'Kebutuhan', 'Rekening Bank')
    push(at(y, m, 9, 8), 'Transportasi Bulanan', 650_000 + wave * 60_000, 'expense', 'Transport', 'E-Wallet')
    push(at(y, m, 15, 13), 'Makan & Groceries', 2_050_000 + wave * 90_000, 'expense', 'Makan', 'Rekening Bank')
    push(at(y, m, 21, 20), 'Hiburan & Langganan', 520_000 + wave * 45_000, 'expense', 'Hiburan', 'E-Wallet')
  }

  // Bulan berjalan — transaksi granular
  const dom = now.getDate()
  const dayAt = (offset, hour = 12) =>
    new Date(now.getFullYear(), now.getMonth(), Math.max(1, dom - offset), hour, 0, 0)

  const salaryDate = dom >= 26 ? at(Y, M, 25, 9) : at(Y, M, 1, 9)
  push(salaryDate, 'Gaji Bulanan', 8_750_000, 'income', 'Gaji', 'Rekening Bank')

  // Makan
  push(dayAt(1, 19), 'Warung Nasi Padang', 28_000, 'expense', 'Makan', 'Cash')
  push(dayAt(2, 8), 'Kopi Kenangan', 42_000, 'expense', 'Makan', 'E-Wallet')
  push(dayAt(4, 19), 'Makan Malam Keluarga', 215_000, 'expense', 'Makan', 'Rekening Bank')
  push(dayAt(7, 17), 'Groceries Mingguan', 486_000, 'expense', 'Makan', 'Rekening Bank')
  push(dayAt(9, 13), 'GoFood Nasi Goreng', 96_000, 'expense', 'Makan', 'E-Wallet')
  push(dayAt(12, 12), 'Bakso & Es Teh', 55_000, 'expense', 'Makan', 'Cash')

  // Transport
  push(dayAt(3, 7), 'Bensin Pertalite', 150_000, 'expense', 'Transport', 'Cash')
  push(dayAt(5, 8), 'Top Up Kartu KRL', 100_000, 'expense', 'Transport', 'E-Wallet')
  push(dayAt(8, 18), 'Gojek Pulang Kantor', 54_000, 'expense', 'Transport', 'E-Wallet')
  push(dayAt(15, 10), 'Parkir & Tol', 85_000, 'expense', 'Transport', 'Cash')

  // Kebutuhan
  push(dayAt(6, 11), 'Belanja Bulanan Supermarket', 978_000, 'expense', 'Kebutuhan', 'Rekening Bank')
  push(dayAt(10, 20), 'Token Listrik', 202_000, 'expense', 'Kebutuhan', 'E-Wallet')
  push(dayAt(13, 16), 'Perlengkapan Mandi', 96_000, 'expense', 'Kebutuhan', 'Cash')
  push(dayAt(16, 9), 'Kuota Internet', 150_000, 'expense', 'Kebutuhan', 'E-Wallet')

  // Hiburan (sengaja sedikit melebihi kuota agar indikator merah ikut tampil)
  push(dayAt(2, 21), 'Langganan Netflix', 186_000, 'expense', 'Hiburan', 'E-Wallet')
  push(dayAt(11, 20), 'Nonton Bioskop', 120_000, 'expense', 'Hiburan', 'Cash')
  push(dayAt(14, 22), 'Game Steam Sale', 289_000, 'expense', 'Hiburan', 'E-Wallet')
  push(dayAt(17, 21), 'Karaoke Weekend', 350_000, 'expense', 'Hiburan', 'Rekening Bank')

  rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return rows
}
