import { useCallback, useEffect, useRef } from 'react'
import { socket } from '@/utils/lib/socket'
import { useChatStore } from '@/utils/stores/chat_store'
import { useAuthStore } from '@/utils/stores/auth_store'
import type { Message } from '@/utils/types/chat'
import { toast } from 'sonner'


export function useChat() {
	const token = useAuthStore((s) => s.token)
	const addMessage = useChatStore((s) => s.addMessage)
	const addConversation = useChatStore((s) => s.addConversation)
	const setActiveConversation = useChatStore((s) => s.setActiveConversation)
	const wasDisconnectedRef = useRef(false)

	useEffect(() => {
		if (!token)
			return

		socket.auth = { token }
		socket.connect()

		const onCreated = ({ conversationId }: { conversationId: number }) => {
			addConversation({ id: conversationId })
			setActiveConversation(conversationId)
		}
		const onReceived = (message: Message) => addMessage(message)
		const onError = ({ message }: { message: string }) =>
			toast.error(message)

		const onDisconnect = () => {
			wasDisconnectedRef.current = true
			toast.error("Connection lost", { id: 'socket-status' })
		}

		const onConnect = () => {
			if (!wasDisconnectedRef.current)
				return
			wasDisconnectedRef.current = false
			toast.success("Reconnected", { id: 'socket-status' })
		}

		socket.on('conversation:created', onCreated)
		socket.on('message:received', onReceived)
		socket.on('error', onError)
		socket.on('disconnect', onDisconnect)
		socket.on('connect', onConnect)

		return () => {
			socket.off('conversation:created', onCreated)
			socket.off('message:received', onReceived)
			socket.off('error', onError)
		}
	}, [token, addMessage, addConversation])

	const createConversation = useCallback(
		(participantIds: string[]) => socket.emit('conversation:create', { participantIds }),
		[],
	)

	const joinConversation = useCallback(
		(conversationId: number) => socket.emit('conversation:join', { conversationId }),
		[],
	)

	const sendMessage = useCallback(
		(conversationId: number, content: string) =>
			socket.emit('message:send', { conversationId, content }),
		[],
	)

	return { createConversation, joinConversation, sendMessage }
}