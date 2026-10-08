import { useLayoutEffect, useRef } from 'react'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Message, MessageContent, MessageFooter } from '@/components/ui/message'
import type { Message as ChatMessage } from '@/utils/types/chat'

interface MessageThreadProps {
	messages: ChatMessage[]
	currentUserId: string
	hasMore: boolean
	onLoadOlder: () => Promise<void>
}

const SCROLL_THRESHOLD = 50

function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDay(iso: string): string {
	const date = new Date(iso)
	const today = new Date()
	const yesterday = new Date()
	yesterday.setDate(today.getDate() - 1)

	if (date.toDateString() === today.toDateString())
		return "Aujourd'hui"
	if (date.toDateString() === yesterday.toDateString())
		return 'Hier'
	return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export function MessageThread({ messages, currentUserId, hasMore, onLoadOlder }: MessageThreadProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const shouldRestoreRef = useRef(false)
	const prevScrollHeightRef = useRef(0)
	const loadingRef = useRef(false)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container)
			return
		if (shouldRestoreRef.current) {
			container.scrollTop = container.scrollHeight - prevScrollHeightRef.current
			shouldRestoreRef.current = false
		} else {
			container.scrollTop = container.scrollHeight
		}
	}, [messages])

	const handleScroll = async () => {
		const container = containerRef.current
		console.log('TEST SCROLL')
		if (!container || !hasMore || loadingRef.current || shouldRestoreRef.current)
			return
		if (container.scrollTop <= SCROLL_THRESHOLD) {
			loadingRef.current = true
			prevScrollHeightRef.current = container.scrollHeight
			shouldRestoreRef.current = true
			await onLoadOlder()
			loadingRef.current = false
		}
	}

	if (messages.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center px-6">
				<p className="text-sm text-muted-foreground">
					Aucun message. Écris le premier.
				</p>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			onScroll={handleScroll}
			className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
		>
			{messages.map((message, index) => {
				const isOwn = message.senderId === currentUserId
				const previous = messages[index - 1]
				const showDay =
					!previous ||
					new Date(previous.createdAt).toDateString() !==
						new Date(message.createdAt).toDateString()

				return (
					<div key={message.id}>
						{showDay && (
							<div className="my-6 flex items-center gap-3 first:mt-0">
								<span className="h-px flex-1 bg-border" />
								<span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
									{formatDay(message.createdAt)}
								</span>
								<span className="h-px flex-1 bg-border" />
							</div>
						)}

						<Message align={isOwn ? 'end' : 'start'}>
							<MessageContent>
								<Bubble variant={isOwn ? 'default' : 'secondary'}>
									<BubbleContent className="whitespace-pre-wrap break-words">
										{message.content}
									</BubbleContent>
								</Bubble>
								<MessageFooter className="font-mono text-[10px] text-muted-foreground">
									{formatTime(message.createdAt)}
								</MessageFooter>
							</MessageContent>
						</Message>
					</div>
				)
			})}
			<div className="h-2" />
		</div>
	)
}