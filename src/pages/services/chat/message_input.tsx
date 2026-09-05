import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const schema = z.object({
	content: z.string().trim().min(1),
})

type FormValues = z.infer<typeof schema>

interface MessageInputProps {
	onSend: (content: string) => void
	placeholder?: string
}

export function MessageInput({ onSend, placeholder = i18next.t('write-Message', 'Éwrite un message…') }: MessageInputProps) {
	const { t } = useTranslation()
	const { register, handleSubmit, reset, watch } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { content: '' },
	})

	const canSend = watch('content').trim().length > 0

	const submit = handleSubmit(({ content }) => {
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
					className="h-11 rounded-full border-transparent bg-muted px-5 focus-visible:border-input focus-visible:bg-background"
				/>
				<Button
					type="submit"
					size="icon"
					disabled={!canSend}
					className="size-11 shrink-0 rounded-full transition-opacity disabled:opacity-30"
				>
					<ArrowUp className="size-4" strokeWidth={2.5} />
					<span className="sr-only">{t('envoyer', 'Envoyer')}</span>
				</Button>
			</div>
		</form>
	)
}