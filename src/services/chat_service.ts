import api from '@/utils/lib/axios'
import type { Conversation, Message } from '@/utils/types/chat'

export const chatService = {
	fetchConversations: async (): Promise<Conversation[]> => {
		const { data } = await api.get<{ data: Conversation[] }>('/messaging/conversations')
		return data.data
	},

	fetchMessages: async (conversationId: number): Promise<Message[]> => {
		const { data } = await api.get<{ data: Message[] }>(`/messaging/conversations/${conversationId}/messages`,)
		return data.data
	},
}