import api from "@/utils/lib/axios"
import type { Conversation, Message } from "@/utils/types/chat"

const PAGE_SIZE = 30
export type ConversationExport = Conversation & { messages: Message[] }

export const chatService = {
  fetchConversations: async (): Promise<Conversation[]> => {
    const { data } = await api.get<{ data: Conversation[] }>(
      "/api/messaging/conversations",
    )
    return data.data
  },

  fetchMessages: async (conversationId: number, before?: number): Promise<Message[]> => {
    const { data } = await api.get<{ data: Message[] }>(
      `/api/messaging/conversations/${conversationId}/messages`,
      { params: before ? { before } : undefined },
    )
    return data.data
  },

	fetchAllMessages: async (conversationId: number): Promise<Message[]> => {
	const all: Message[] = []
	let before: number | undefined

	while (true) {
		const page = await chatService.fetchMessages(conversationId, before)
		if (page.length === 0)
		break
		all.unshift(...page)
		if (page.length < PAGE_SIZE)
		break
		before = page[0].id
	}

	return all
	},

	getAllConversationsMessages: async (): Promise<{ data: ConversationExport[] }> => {
	const conversations = await chatService.fetchConversations()
	const result: ConversationExport[] = []

	for (const conversation of conversations) {
		const messages = await chatService.fetchAllMessages(conversation.id)
		result.push({ ...conversation, messages })
	}

	return { data: result }
	},
}
