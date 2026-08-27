import { NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/utils/stores/auth_store'
import { avatarColor, initials } from '@/utils/lib/avatar'
import { useTranslation } from 'react-i18next'

const NAV_ITEMS = [
	{ to: '/', label: 'Membres', end: true },
	{ to: '/chat', label: 'Messagerie', end: false },
]

export function AppHeader() {
	const { t } = useTranslation()
	const { user, logout } = useAuthStore()

	const handleLogout = () => {
		logout()
	}

	return (
		<header className="flex h-14 shrink-0 items-center justify-between border-b px-5">
			<div className="flex items-center gap-8">
				<div className="flex items-center gap-2.5">
					<span className="size-2 rounded-full bg-emerald-500" />
					<span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
						Raiders.io
					</span>
				</div>

				<nav className="flex items-center gap-1">
					{NAV_ITEMS.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`rounded-md px-3 py-1.5 text-sm transition-colors ${
									isActive
										? 'bg-secondary font-medium text-foreground'
										: 'text-muted-foreground hover:text-foreground'
								}`
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden items-center gap-2.5 sm:flex">
					<span
						className={`flex size-7 items-center justify-center rounded-full text-[10px] font-medium text-white ${avatarColor(user?.fullName ?? '')}`}
					>
						{initials(user?.fullName ?? '?')}
					</span>
					<span className="text-sm text-foreground">{user?.fullName}</span>
				</div>

				<button
					onClick={handleLogout}
					className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
				>
					<LogOut className="size-4" />
					<span className="sr-only">{t('seDconnecter', 'Se déconnecter')}</span>
				</button>
			</div>
		</header>
	)
}