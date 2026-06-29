import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@/utils/types/chat'

const URL: string = 'https://localhost:4443'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
	path: '/api/socket.io',
	autoConnect: false,
	transports: ['websocket'],
})
 