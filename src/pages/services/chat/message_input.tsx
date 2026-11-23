import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { socket } from '@/utils/lib/socket'

const MAX_LENGTH = 2000

const schema = z.object({
	content: z.string().trim().min(1).max(MAX_LENGTH),
})

type FormValues = z.infer<typeof schema>

interface MessageInputProps {
	onSend: (content: string) => void
	placeholder?: string
}

export function MessageInput({ onSend, placeholder = 'Écrire un message…' }: MessageInputProps) {
	const { register, handleSubmit, reset, watch } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { content: '' },
	})

	const content = watch('content')
	const canSend = content.trim().length > 0 && content.length <= MAX_LENGTH

	const submit = handleSubmit(({ content }) => {
		if (!socket.connected) {
			toast.error('Pas de connexion, message non envoyé')
			return
		}
		onSend(content)
		reset()
	})

	return (
		<form onSubmit={submit} className="shrink-0 border-t p-4">
			<div className="flex items-center gap-2">
				<Input
					{...register('content')}
					placeholder={placeholder}
					autoComplete="off"
					maxLength={MAX_LENGTH}
					className="h-11 flex-1 rounded-full border-transparent bg-muted px-5 focus-visible:border-input focus-visible:bg-background"
				/>
				<Button
					type="submit"
					size="icon"
					disabled={!canSend}
					className="size-11 shrink-0 rounded-full transition-opacity disabled:opacity-30"
				>
					<ArrowUp className="size-4" strokeWidth={2.5} />
					<span className="sr-only">Envoyer</span>
				</Button>
			</div>
			{content.length > MAX_LENGTH - 200 && (
				<p className="mt-1 pr-14 text-right font-mono text-[10px] text-muted-foreground">
					{content.length} / {MAX_LENGTH}
				</p>
			)}
		</form>
	)
}