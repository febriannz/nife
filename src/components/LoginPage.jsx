import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import LogoMark from './LogoMark'

const inputClass =
  'w-full rounded-xl border border-[#26202B] bg-[#0E0C10] py-2.5 pl-10 pr-3.5 text-[12.5px] text-[#F4EFF6] placeholder:text-[#7A7080] outline-none transition focus:border-[#6E4D69]'

export default function LoginPage({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const fn = mode === 'signin' ? onSignIn : onSignUp
      const { data, error: err } = await fn(email.trim(), password)
      if (err) throw err
      if (mode === 'signup' && data && !data.session) {
        setNotice('Akun dibuat. Cek email untuk konfirmasi sebelum masuk.')
      }
    } catch (err) {
      setError(err?.message || 'Terjadi kesalahan, coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-[72vh] place-items-center">
      <div className="animate-fade-pop w-full max-w-[400px] rounded-[28px] border border-[#2E2532] bg-gradient-to-b from-[#1D171F] to-[#120E14] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-5 w-5 text-[#F4EFF6]" />
          <span className="text-[15px] font-semibold text-[#F4EFF6]">Nife Finance</span>
        </div>

        <h1 className="mt-6 text-[20px] font-semibold text-[#F4EFF6]">
          {mode === 'signin' ? 'Masuk ke akunmu' : 'Buat akun baru'}
        </h1>
        <p className="mt-1 text-[11.5px] text-[#7A7080]">
          Kelola saldo, transaksi, dan anggaran dalam satu dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7080]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kamu.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7080]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClass}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="text-[11px] text-[#C95B68]">{error}</p>}
          {notice && <p className="text-[11px] text-[#4E9F76]">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 w-full rounded-full bg-gradient-to-b from-[#9E7698] to-[#593E55] py-3 text-[12.5px] font-semibold text-white shadow-[0_14px_36px_-14px_rgba(158,118,152,0.9)] transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? 'Memproses...' : mode === 'signin' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
            setNotice('')
          }}
          className="mt-5 w-full text-center text-[11.5px] text-[#7A7080] transition hover:text-[#C89BBF]"
        >
          {mode === 'signin' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span className="font-medium text-[#C89BBF]">{mode === 'signin' ? 'Daftar' : 'Masuk'}</span>
        </button>
      </div>
    </div>
  )
}
