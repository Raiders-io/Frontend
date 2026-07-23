import { useEffect, useState } from 'react'
import { MessagesSquare } from 'lucide-react'
import { useChat } from '@/utils/hooks/use_chat'
import { useChatStore } from '@/utils/stores/chat_store'
import { useAuthStore } from '@/utils/stores/auth_store'
import { chatService } from '@/services/chat_service'
import { userService } from '@/services/user_service'
import { avatarColor, initials } from '@/utils/lib/avatar'
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

	const activeConversation = conversations.find((c) => c.id === activeConversationId)
	const activeLabel = conversationLabel(activeConversation?.participantIds ?? [])
	const activeMessages = activeConversationId ? messages[activeConversationId] ?? [] : []

	return (
		<div className="flex h-full flex-col">
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
								<span
									className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white ${avatarColor(activeLabel)}`}
								>
									{initials(activeLabel)}
								</span>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-foreground">
										{activeLabel}
									</p>
									<p className="font-mono text-[11px] text-muted-foreground">
										{activeMessages.length} message{activeMessages.length > 1 ? 's' : ''}
									</p>
								</div>
							</header>

							<MessageThread messages={activeMessages} currentUserId={currentUserId} />
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