import { useAuth } from './hooks/useAuth'
import Dashboard from './components/Dashboard'
import LoginPage from './components/LoginPage'
import LogoMark from './components/LogoMark'

/** Canvas luar #0B090C + ambient glow radial #2A1829 di sudut-sudut. */
function Canvas({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B090C] font-sans text-[#F4EFF6]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(900px 620px at -6% -12%, rgba(42,24,41,0.85), transparent 62%), radial-gradient(820px 540px at 106% 112%, rgba(42,24,41,0.9), transparent 58%), radial-gradient(760px 520px at 52% 124%, rgba(42,24,41,0.5), transparent 60%)',
        }}
      />
      <div className="relative mx-auto w-full max-w-[1320px] px-4 py-6 md:px-7 md:py-9">
        <main className="rounded-[32px] border border-[#2E2532] bg-gradient-to-b from-[#1D171F] to-[#120E14] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.55)] md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function SplashScreen() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="animate-pulse-soft flex flex-col items-center gap-3">
        <LogoMark className="h-10 w-10 text-[#C89BBF]" />
        <p className="text-[10.5px] uppercase tracking-[0.35em] text-[#7A7080]">Nife Finance</p>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth()

  return (
    <Canvas>
      {loading ? (
        <SplashScreen />
      ) : user ? (
        <Dashboard user={user} onSignOut={signOut} />
      ) : (
        <LoginPage onSignIn={signIn} onSignUp={signUp} />
      )}
    </Canvas>
  )
}
