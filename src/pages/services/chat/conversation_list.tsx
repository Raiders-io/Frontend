import type { Conversation } from '@/utils/types/chat'

interface ConversationListProps {
	conversations: Conversation[]
	activeId: number | null
	onSelect: (conversationId: number) => void
	getLabel: (participantIds: string[]) => string
}

export function ConversationList({ conversations, activeId, onSelect, getLabel }: ConversationListProps) {
	return (
		<aside className="w-64 shrink-0 overflow-y-auto border-r">
			{conversations.length === 0 ? (
				<p className="p-4 text-sm text-muted-foreground">Aucune conversation</p>
			) : (
				conversations.map((conversation) => (
					<button
						key={conversation.id}
						onClick={() => onSelect(conversation.id)}
						className={`block w-full px-4 py-3 text-left text-sm hover:bg-muted ${
							activeId === conversation.id ? 'bg-muted font-medium' : ''
						}`}
					>
						{getLabel(conversation.participantIds ?? [])}
					</button>
				))
			)}
		</aside>
	)
}