import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth_service'
import { useAuthStore } from '@/utils/stores/auth_store'
import { AuthLayout } from '@/pages/auth/auth_layout'
import { changePageHome } from '@/utils/router/changePage'

const signupSchema = z.object({
	fullName: z.string().min(2, 'Nom trop court'),
	email: z.string().email('Email invalide'),
	password: z.string().min(8, 'Mot de passe trop court'),
	passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
	message: 'Les mots de passe ne correspondent pas',
	path: ['passwordConfirmation'],
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
	const { setAuth } = useAuthStore()
	const [formError, setFormError] = useState<string | null>(null)

	const { register, handleSubmit, formState } = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
	})
	const { errors, isSubmitting } = formState

	const onSubmit = async (data: SignupForm) => {
		setFormError(null)
		try {
			const response = await authService.signup(data)
			setAuth(response.data.user, response.data.token)
			changePageHome()
		} catch (error) {
			console.error('Signup error:', error)
			setFormError(
				isAxiosError(error) && error.response?.status === 422
					? 'Cet email est déjà utilisé.'
					: 'La création du compte a échoué. Réessaie dans un instant.',
			)
		}
	}

	return (
		<AuthLayout
			title="Créer un compte"
			subtitle="Quelques informations et tu peux commencer."
			footer={
				<>
					Déjà un compte ?{' '}
					<Link
						to="/login"
						className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
					>
						Se connecter
					</Link>
				</>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
				<div className="space-y-1.5">
					<Label htmlFor="fullName" className="text-xs font-medium text-foreground">
						Nom
					</Label>
					<Input
						id="fullName"
						placeholder="Ada Lovelace"
						autoComplete="name"
						className="h-11 bg-background"
						{...register('fullName')}
					/>
					<p className="min-h-4 text-xs leading-4 text-destructive">
						{errors.fullName?.message}
					</p>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-xs font-medium text-foreground">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						placeholder="exemple@gmail.com"
						autoComplete="email"
						className="h-11 bg-background"
						{...register('email')}
					/>
					<p className="min-h-4 text-xs leading-4 text-destructive">
						{errors.email?.message}
					</p>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password" className="text-xs font-medium text-foreground">
						Mot de passe
					</Label>
					<Input
						id="password"
						type="password"
						autoComplete="new-password"
						className="h-11 bg-background"
						{...register('password')}
					/>
					<p
						className={`min-h-4 text-xs leading-4 ${
							errors.password ? 'text-destructive' : 'text-muted-foreground'
						}`}
					>
						{errors.password?.message ?? '8 caractères minimum.'}
					</p>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="passwordConfirmation" className="text-xs font-medium text-foreground">
						Confirmer le mot de passe
					</Label>
					<Input
						id="passwordConfirmation"
						type="password"
						autoComplete="new-password"
						className="h-11 bg-background"
						{...register('passwordConfirmation')}
					/>
					<p className="min-h-4 text-xs leading-4 text-destructive">
						{errors.passwordConfirmation?.message}
					</p>
				</div>

				{formError && (
					<div className="rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3">
						<p className="text-sm text-destructive">{formError}</p>
					</div>
				)}

				<Button type="submit" disabled={isSubmitting} className="mt-2 h-11 w-full">
					{isSubmitting ? 'Création…' : 'Créer un compte'}
				</Button>
			</form>
		</AuthLayout>
	)
}