export interface Message {
	id: number
	conversationId: number
	senderId: string
	content: string
	createdAt: string
	updatedAt: string
}
 
export interface Conversation {
	id: number
	participantIds?: string[]
	lastMessage?: Message
	createdAt?: string
	updatedAt?: string
}
 
export interface ServerToClientEvents {
	'conversation:created': (data: { conversationId: number }) => void
	'conversation:joined': (data: { conversationId: number }) => void
	'message:received': (message: Message) => void
	'error': (data: { message: string }) => void
}
 
export interface ClientToServerEvents {
	'conversation:create': (data: { participantIds: string[] }) => void
	'conversation:join': (data: { conversationId: number }) => void
	'message:send': (data: { conversationId: number; content: string }) => void
}