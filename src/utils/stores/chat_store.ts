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
	prependMessages: (conversationId: number, older: Message[]) => void
	setActiveConversation: (conversationId: number | null) => void
}

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

	prependMessages: (conversationId, older) =>
		set((state) => {
			const existing = state.messages[conversationId] ?? []
			const existingIds = new Set(existing.map((m) => m.id))
			const toAdd = older.filter((m) => !existingIds.has(m.id))
			if (toAdd.length === 0)
				return state
			const newMessages = { ...state.messages }
			newMessages[conversationId] = [...toAdd, ...existing]
			return { messages: newMessages }
		}),

	setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),
}))