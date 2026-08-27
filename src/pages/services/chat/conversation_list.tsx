import type { Conversation } from '@/utils/types/chat'
import { avatarColor, initials } from '@/utils/lib/avatar'
import { useTranslation } from 'react-i18next'

interface ConversationListProps {
	conversations: Conversation[]
	activeId: number | null
	onSelect: (conversationId: number) => void
	getLabel: (participantIds: string[]) => string
}

export function ConversationList({ conversations, activeId, onSelect, getLabel }: ConversationListProps) {
	const { t } = useTranslation()
	return (
		<aside className="flex w-72 shrink-0 flex-col border-r">
			<div className="flex h-14 shrink-0 items-center justify-between border-b px-5">
				<h2 className="text-sm font-medium text-foreground">{t('conversations', 'Conversations')}</h2>
				<span className="font-mono text-[11px] text-muted-foreground">
					{conversations.length}
				</span>
			</div>

			<div className="flex-1 overflow-y-auto p-2">
				{conversations.length === 0 ? (
					<p className="px-3 py-8 text-center text-sm text-muted-foreground">
						{t('no-conversation', 'Aucune conversation.')}
					</p>
				) : (
					<ul className="space-y-px">
						{conversations.map((conversation) => {
							const label = getLabel(conversation.participantIds ?? [])
							const isActive = activeId === conversation.id

							return (
								<li key={conversation.id}>
									<button
										onClick={() => onSelect(conversation.id)}
										className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
											isActive ? 'bg-secondary' : 'hover:bg-muted/50'
										}`}
									>
										<span
											className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white ${avatarColor(label)}`}
										>
											{initials(label)}
										</span>
										<span
											className={`truncate text-sm ${
												isActive ? 'font-medium text-foreground' : 'text-foreground/80'
											}`}
										>
											{label}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</aside>
	)
}