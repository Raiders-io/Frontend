import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authService } from '@/services/auth_service'
import { useAuthStore } from '@/utils/stores/auth_store'

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
	const navigate = useNavigate()
	const { setAuth } = useAuthStore()

	const { register, handleSubmit, formState } = useForm<SignupForm>({
		resolver: zodResolver(signupSchema),
	})
	const errors = formState.errors;
	const isSubmitting = formState.isSubmitting;

	const onSubmit = async (data: SignupForm) => {
		try {
			const response = await authService.signup(data)
			setAuth(response.data.user, response.data.token)
			navigate('/')
		} catch (error) {
			console.error('Signup error:', error)
		}
	}

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Créer un compte</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<Label htmlFor="fullName">Nom</Label>
							<Input
								id="fullName"
								placeholder="Mickael Vendetta"
								{...register('fullName')}
							/>
							{errors.fullName && (
								<p>{errors.fullName.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@gamil.com"
								{...register('email')}
							/>
							{errors.email && (
								<p>{errors.email.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="password">Mot de passe</Label>
							<Input
								id="password"
								type="password"
								{...register('password')}
							/>
							{errors.password && (
								<p>{errors.password.message}</p>
							)}
						</div>
						<div>
							<Label htmlFor="passwordConfirmation">Confirmer le mot de passe</Label>
							<Input
								id="passwordConfirmation"
								type="password"
								{...register('passwordConfirmation')}
							/>
							{errors.passwordConfirmation && (
								<p>{errors.passwordConfirmation.message}</p>
							)}
						</div>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Création...' : 'Créer un compte'}
						</Button>
						<p>
							Déjà un compte ?
							<Link to="/login">
								Se connecter
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}