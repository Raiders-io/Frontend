import { useEffect, useRef } from 'react'
import type { Message } from '@/utils/types/chat'

interface MessageThreadProps {
	messages: Message[]
	currentUserId: string
}

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className="flex-1 space-y-2 overflow-y-auto p-4">
			{messages.map((message) => {
				const isOwn = message.senderId === currentUserId
				return (
					<div
						key={message.id}
						className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
								isOwn
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-foreground'
							}`}
						>
							{message.content}
						</div>
					</div>
				)
			})}
			<div ref={bottomRef} />
		</div>
	)
}
