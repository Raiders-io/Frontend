import { useEffect, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { useChat } from '@/utils/hooks/use_chat'
import { useChatStore } from '@/utils/stores/chat_store'
import { useAuthStore } from '@/utils/stores/auth_store'
import { chatService } from '@/services/chat_service'
import { userService } from '@/services/user_service'
import { avatarColor, initials } from '@/utils/lib/avatar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppHeader } from '@/components/app_header'
import { ConversationList } from './conversation_list'
import { MessageThread } from './message_thread'
import { MessageInput } from './message_input'
import type { User } from '@/utils/types/auth'

export default function ChatPage() {
	const { sendMessage } = useChat()
	const currentUserId = useAuthStore((s) => s.user?.id ?? '')
	const conversations = useChatStore((s) => s.conversations)
	const messages = useChatStore((s) => s.messages)
	const activeConversationId = useChatStore((s) => s.activeConversationId)
	const setConversations = useChatStore((s) => s.setConversations)
	const setMessages = useChatStore((s) => s.setMessages)
	const setActiveConversation = useChatStore((s) => s.setActiveConversation)
	const [userMap, setUserMap] = useState<Record<string, string>>({})
	const prependMessages = useChatStore((s) => s.prependMessages)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		userService.fetchUsers()
			.then((users: User[]) => {
				const map: Record<string, string> = {}
				for (const u of users)
					map[u.id] = u.fullName
				setUserMap(map)
			})
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

	useEffect(() => {
		chatService.fetchConversations()
			.then(setConversations)
			.catch(console.error)
	}, [setConversations])

	const conversationLabel = (participantIds: string[] = []): string => {
		const names = participantIds
			.filter((id) => id !== currentUserId)
			.map((id) => userMap[id] ?? 'Utilisateur inconnu')
		return names.length > 0 ? names.join(', ') : 'Conversation vide'
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

	return (
		<div className="flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
			<AppHeader />

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
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-foreground">
										{activeLabel}
									</p>
									<p className="font-mono text-[11px] text-muted-foreground">
										{activeMessages.length} message{activeMessages.length > 1 ? 's' : ''}
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
								placeholder={`Écrire à ${activeLabel}…`}
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
								Aucune conversation ouverte
							</p>
							<p className="max-w-xs text-center text-sm text-muted-foreground">
								Sélectionne une conversation à gauche, ou démarres-en une depuis
								la liste des membres.
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	)
}