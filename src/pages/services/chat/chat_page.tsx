import { useEffect, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useChat } from '@/utils/hooks/use_chat'
import { useChatStore } from '@/utils/stores/chat_store'
import { useAuthStore } from '@/utils/stores/auth_store'
import { chatService } from '@/services/chat_service'
import { avatarColor, initials } from '@/utils/lib/avatar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConversationList } from './conversation_list'
import { MessageThread } from './message_thread'
import { MessageInput } from './message_input'
import { authService } from '@/services/auth_service'
import { useTranslation } from 'react-i18next'

export default function ChatPage() {
	const { t } = useTranslation()
	const { sendMessage } = useChat()
	const currentUserId = useAuthStore((s) => s.user?.id ?? '')
	const messages = useChatStore((s) => s.messages)
	const activeConversationId = useChatStore((s) => s.activeConversationId)
	const setMessages = useChatStore((s) => s.setMessages)
	const setActiveConversation = useChatStore((s) => s.setActiveConversation)
	const [userMap, setUserMap] = useState<Record<string, string>>({})
	const prependMessages = useChatStore((s) => s.prependMessages)
	const [hasMore, setHasMore] = useState(true)

	const { data: conversations = [], isError } = useQuery({
		queryKey: ['conversations'],
		queryFn: chatService.fetchConversations,
	})

	useEffect(() => {
	authService.fetchUsers()
		.then((users) =>
		setUserMap(Object.fromEntries(users.map((u) => [u.id, u.fullName]))),
		)
		.catch(console.error)
	}, [])

	useEffect(() => {
		if (activeConversationId === null)
			return
		setHasMore(true)
		chatService.fetchMessages(activeConversationId)
			.then((history) => setMessages(activeConversationId, history))
			.catch(console.error)
	}, [activeConversationId])

	const conversationLabel = (participantIds: string[] = []): string => {
		const names = participantIds
			.filter((id) => id !== currentUserId)
			.map((id) => userMap[id] ?? t('unknown-user', 'Utilisateur inconnu'))
		return names.length > 0 ? names.join(', ') : t('empty-conversation', 'Conversation vide')
	}

	const loadOlder = async () => {
		if (activeConversationId === null)
			return
		const current = messages[activeConversationId] ?? []
		const oldest = current[0]
		if (!oldest)
			return
		const older = await chatService.fetchMessages(activeConversationId, oldest.id)
		prependMessages(activeConversationId, older)
		if (older.length < 30)
			setHasMore(false)
	}

	const activeConversation = conversations.find((c) => c.id === activeConversationId)
	const activeLabel = conversationLabel(activeConversation?.participantIds ?? [])
	const activeMessages = activeConversationId ? messages[activeConversationId] ?? [] : []

	return isError ? (
		<div className="flex h-full items-center justify-center">
			<p className="text-sm text-destructive">{t('erreurDeChargement', 'Erreur de chargement')}</p>
		</div>
	) : (
		<div className="flex h-full flex-col">
			<div className="flex min-h-0 flex-1">
				<ConversationList
					conversations={conversations}
					activeId={activeConversationId}
					onSelect={setActiveConversation}
					getLabel={conversationLabel}
				/>
				<main className="flex min-w-0 flex-1 flex-col">
					{activeConversationId ? (
						<>
							<header className="flex h-14 shrink-0 items-center gap-3 border-b px-6">
								<Avatar className="size-8 shrink-0">
									<AvatarFallback className={`text-[10px] font-medium text-white ${avatarColor(activeLabel)}`}>
										{initials(activeLabel)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 [&>p]:mt-0">
									<p className="truncate text-sm font-medium text-foreground">
										{activeLabel}
									</p>
								</div>
							</header>

							<MessageThread 
								messages={activeMessages} 
								currentUserId={currentUserId} 
								hasMore={hasMore}
								onLoadOlder={loadOlder}
							/>
							<MessageInput
								placeholder={t('writeActivelabel', 'Write to {{activeLabel}}…', { activeLabel })}
								onSend={(content) => sendMessage(activeConversationId, content)}
							/>
						</>
					) : (
						<div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
							<MessagesSquare
								className="size-9 text-muted-foreground/30"
								strokeWidth={1.25}
							/>
							<p className="text-sm font-medium text-foreground">
								{t('no-conversation-opened', 'No conversation opened')}
							</p>
							<p className="max-w-xs text-center text-sm text-muted-foreground">
								{t('select-conversation-or-start-one', 'Select a conversation to the left, or start one from your friends list.')}
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}