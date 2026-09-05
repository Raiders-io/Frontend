import { useEffect, useState } from 'react'
import { useChat } from '@/utils/hooks/use_chat'
import { userService } from '@/services/user_service'
import { avatarColor, initials } from '@/utils/lib/avatar'
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app_header'
import type { User } from '@/utils/types/auth'
import { changePageHome } from '@/utils/router/changePage'
import { useTranslation } from 'react-i18next'

export default function UsersList() {
	const { t } = useTranslation()
	const { createConversation } = useChat()
	const [members, setMembers] = useState<User[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		userService.fetchUsers()
			.then(setMembers)
			.catch(console.error)
			.finally(() => setIsLoading(false))
	}, [])

	const startConversation = (userId: string) => {
		createConversation([userId])
		changePageHome()
	}

	return (
		<div className="flex h-full flex-col">
			<AppHeader />

			<main className="flex-1 overflow-y-auto">
				<div className="mx-auto max-w-2xl px-6 py-14">
					<h1 className="text-[26px] font-semibold tracking-tight text-foreground">
						{t('membres', 'Membres')}
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						{t('choose-someone-to-contact', 'Choisis quelqu\'un pour démarrer une conversation.')}
					</p>

					<div className="mt-9">
						{isLoading ? (
							<ul className="divide-y rounded-lg border">
								{[0, 1, 2].map((i) => (
									<li key={i} className="flex items-center gap-3.5 px-4 py-3.5">
										<span className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
										<div className="flex-1 space-y-2">
											<span className="block h-3.5 w-32 animate-pulse rounded bg-muted" />
											<span className="block h-3 w-44 animate-pulse rounded bg-muted" />
										</div>
									</li>
								))}
							</ul>
						) : members.length === 0 ? (
							<div className="rounded-lg border border-dashed px-6 py-14 text-center">
								<p className="text-sm font-medium text-foreground">
									{t('no-one-now', 'Personne d\'autre pour l\'instant')}
								</p>
								<p className="mt-1.5 text-sm text-muted-foreground">
									{t('new-accounts-message', 'Les nouveaux comptes apparaîtront ici.')}
								</p>
							</div>
						) : (
							<ul className="divide-y overflow-hidden rounded-lg border">
								{members.map((member) => (
									<li
										key={member.id}
										className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-muted/40"
									>
										<span
											className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white ${avatarColor(member.fullName)}`}
										>
											{initials(member.fullName)}
										</span>

										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium text-foreground">
												{member.fullName}
											</p>
											<p className="truncate font-mono text-xs text-muted-foreground">
												{member.email}
											</p>
										</div>

										<Button
											variant="outline"
											size="sm"
											onClick={() => startConversation(member.id)}
											className="shrink-0"
										>
											{t('write', 'Éwrite')}
										</Button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}