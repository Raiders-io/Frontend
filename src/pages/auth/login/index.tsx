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
import { isThemeDark } from '@/components/theme-provider'

const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(8, 'Mot de passe trop court'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
	const { setAuth } = useAuthStore()
	const [formError, setFormError] = useState<string | null>(null)

	const { register, handleSubmit, formState } = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	})
	const { errors, isSubmitting } = formState

	const onSubmit = async (data: LoginForm) => {
		setFormError(null)
		try {
			const response = await authService.login(data)
			setAuth(response.data.user, response.data.token)
			changePageHome()
		} catch (error) {
			console.error('Login error:', error)
			setFormError(
				isAxiosError(error) && error.response
					? 'Email ou mot de passe incorrect.'
					: 'Le serveur est injoignable. Réessaie dans un instant.',
			)
		}
	}
	// const onOauthLogin = async (provider: string) => {
	// 	try {
	// 		const response = await authService.oauthLogin(provider)
	// 		setAuth(response.data.user, response.data.token)
	// 		changePageHome()
	// 	} catch (error) {
	// 		console.error('OAuth login error:', error)
	// 		setFormError(
	// 			isAxiosError(error) && error.response
	// 				? 'Error while connecting with OAuth provider.'
	// 				: 'The server is unreachable. Please try again later.',
	// 		)
	// 	}
	// }

	return (
		<AuthLayout
			title="Connexion"
			subtitle="Entre tes identifiants pour accéder à ton compte."
			footer={
				<>
					Pas encore de compte ?{' '}
					<Link
						to="/signup"
						className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
					>
						Créer un compte
					</Link>
				</>
			}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
						autoComplete="current-password"
						className="h-11 bg-background"
						{...register('password')}
					/>
					<p className="min-h-4 text-xs leading-4 text-destructive">
						{errors.password?.message}
					</p>
				</div>

				{formError && (
					<div className="rounded-md border border-destructive/25 bg-destructive/5 px-3.5 py-3">
						<p className="text-sm text-destructive">{formError}</p>
					</div>
				)}

				<Button type="submit" disabled={isSubmitting} className="mt-2 h-11 w-full" aria-label="Se connecter">
					{isSubmitting ? 'Connexion…' : 'Se connecter'}
				</Button>
				<Button className="mt-2 h-11 w-full" /* onClick={() => onOauthLogin("github") }*/>
					{isThemeDark() ? (
						<img height="32" width="32" src="https://cdn.simpleicons.org/github/black" />
					) : (
						<img height="32" width="32" src="https://cdn.simpleicons.org/github/white" />
					)}
					<a href="https://localhost:4443/api/v1/auth/github/redirect">
						Log In with GitHub
					</a>
				</Button>
			</form>
		</AuthLayout>
	)
}