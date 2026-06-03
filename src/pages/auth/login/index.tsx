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

const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(8, 'Mot de passe trop court'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
	const navigate = useNavigate()
	const { setAuth } = useAuthStore()

	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	})

	const onSubmit = async (data: LoginForm) => {
		try {
			const response = await authService.login(data)
			setAuth(response.data.user, response.data.token)
			navigate('/')
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Connexion</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@gmail.com"
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
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Connexion...' : 'Se connecter'}
						</Button>
						<p>
							Pas de compte ?
							<Link to="/signup">
								S'inscrire
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}