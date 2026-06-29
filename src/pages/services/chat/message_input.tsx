import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
	content: z.string().trim().min(1),
})

type FormValues = z.infer<typeof schema>

interface MessageInputProps {
	onSend: (content: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
	const { register, handleSubmit, reset, formState } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { content: '' },
	})

	const submit = handleSubmit(({ content }) => {
		onSend(content)
		reset()
	})

	return (
		<form onSubmit={submit} className="flex gap-2 border-t p-3">
			<Input {...register('content')} placeholder="Écrire un message…" autoComplete="off" />
			<Button type="submit" disabled={formState.isSubmitting}>
				Envoyer
			</Button>
		</form>
	)
}
