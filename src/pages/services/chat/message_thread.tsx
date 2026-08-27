import { useEffect, useRef } from 'react'
import type { Message } from '@/utils/types/chat'
import { useTranslation } from 'react-i18next'

interface MessageThreadProps {
	messages: Message[]
	currentUserId: string
}

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

export function MessageThread({ messages, currentUserId }: MessageThreadProps) {
	const { t } = useTranslation()
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	if (messages.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center px-6">
				<p className="text-sm text-muted-foreground">
					{t('no-message-write-first', 'Aucun message. Écris le premier.')}
				</p>
			</div>
		)
	}

	return (
		<div className="flex-1 overflow-y-auto px-6 py-5">
			{messages.map((message, index) => {
				const isOwn = message.senderId === currentUserId
				const previous = messages[index - 1]
				const isGrouped = previous?.senderId === message.senderId
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

						<div
							className={`group flex ${
								showDay ? '' : isGrouped ? 'mt-1' : 'mt-4'
							} ${isOwn ? 'justify-end' : 'justify-start'}`}
						>
							<div className="flex max-w-[68%] flex-col gap-1">
								<div
									className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
										isOwn
											? 'rounded-br-sm bg-primary text-primary-foreground'
											: 'rounded-bl-sm bg-muted text-foreground'
									}`}
								>
									<p className="whitespace-pre-wrap break-words">{message.content}</p>
								</div>
								<span
									className={`px-1 font-mono text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 ${
										isOwn ? 'text-right' : ''
									}`}
								>
									{formatTime(message.createdAt)}
								</span>
							</div>
						</div>
					</div>
				)
			})}
			<div ref={bottomRef} className="h-2" />
		</div>
	)
}