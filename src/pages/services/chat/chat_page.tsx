import { useEffect, useState } from 'react'
import { useChat } from '@/utils/hooks/use_chat'
import { useChatStore } from '@/utils/stores/chat_store'
import { useAuthStore } from '@/utils/stores/auth_store'
import { chatService } from '@/services/chat_service'
import { userService } from '@/services/user_service'
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
			.map((id) => userMap[id] ?? `User ${id}`)
		return names.length > 0 ? names.join(', ') : 'Conversation vide'
	}

	const handleSelect = (conversationId: number) => {
		setActiveConversation(conversationId)
	}

	const activeMessages = activeConversationId ? messages[activeConversationId] ?? [] : []

	return (
		<div className="flex h-full">
			<ConversationList
				conversations={conversations}
				activeId={activeConversationId}
				onSelect={handleSelect}
				getLabel={conversationLabel}
			/>
			<div className="flex flex-1 flex-col">
				{activeConversationId ? (
					<>
						<MessageThread messages={activeMessages} currentUserId={currentUserId} />
						<MessageInput
							onSend={(content) => sendMessage(activeConversationId, content)}
						/>
					</>
				) : (
					<div className="flex flex-1 items-center justify-center text-muted-foreground">
						Sélectionne une conversation
					</div>
				)}
			</div>
		</div>
	)
}