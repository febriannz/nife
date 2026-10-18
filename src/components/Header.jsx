import { Bell, Settings } from 'lucide-react'

function Avatar({ user, name }) {
  const url = user?.user_metadata?.avatar_url
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-9 w-9 rounded-full border border-[#2E2532] object-cover"
      />
    )
  }
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full border border-[#2E2532] bg-gradient-to-b from-[#9E7698] to-[#593E55] text-[11px] font-semibold text-white">
      {initials || 'H'}
    </div>
  )
}

export default function Header({ user, name, onOpenSettings }) {
  const circleButton =
    'grid h-9 w-9 place-items-center rounded-full border border-[#231D27] bg-[#0E0C10] text-[#C8C2CC] transition hover:border-[#3A2F3E] hover:text-[#F4EFF6]'

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-1 pt-1">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[#F4EFF6] md:text-[24px]">
          Welcome, <span className="text-[#C89BBF]">{name}</span>
        </h1>
        <p className="mt-1 text-[11.5px] text-[#7A7080]">Here&apos;s your personal finance overview</p>
      </div>

      <div className="flex items-center gap-2.5">
        <button title="Notifikasi" className={circleButton}>
          <Bell size={15} />
        </button>
        <button title="Pengaturan" onClick={onOpenSettings} className={circleButton}>
          <Settings size={15} />
        </button>

        <div className="ml-1.5 flex items-center gap-2.5">
          <Avatar user={user} name={name} />
          <div className="hidden text-right sm:block">
            <p className="text-[12px] font-medium leading-tight text-[#F4EFF6]">{name}</p>
            <p className="text-[10.5px] leading-tight text-[#7A7080]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
