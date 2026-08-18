import { create } from 'zustand'
import type { Conversation, Message } from '@/utils/types/chat'

interface ChatState {
	conversations: Conversation[]
	messages: Record<number, Message[]>
	activeConversationId: number | null
	setConversations: (conversations: Conversation[]) => void
	addConversation: (conversation: Conversation) => void
	setMessages: (conversationId: number, messages: Message[]) => void
	addMessage: (message: Message) => void
	setActiveConversation: (conversationId: number | null) => void
}

// TODO: Might want to remove setConv and addConv if not used anywhere (replaced by cache)
export const useChatStore = create<ChatState>((set) => ({
	conversations: [],
	messages: {},
	activeConversationId: null,

	setConversations: (conversations) => set({ conversations }),

	addConversation: (conversation) =>
		set((state) => ({
			conversations: state.conversations.some((c) => c.id === conversation.id)
				? state.conversations
				: [conversation, ...state.conversations],
		})),

	setMessages: (conversationId, messages) =>
		set((state) => {
			const newMessages = { ...state.messages }
			newMessages[conversationId] = messages
			return { messages: newMessages }
	}),

	addMessage: (message) =>
		set((state) => {
			const existing = state.messages[message.conversationId] ?? []
			if (existing.some((m) => m.id === message.id))
				return state
			const newList = [...existing, message]
			const newMessages = { ...state.messages }
			newMessages[message.conversationId] = newList
			return { messages: newMessages }
			}),

	setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),
}))