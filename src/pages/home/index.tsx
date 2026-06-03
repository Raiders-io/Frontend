import { useAuthStore } from '@/utils/stores/auth_store'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
	const { user, logout } = useAuthStore()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<div>
			<h1>Bienvenue {user?.fullName}</h1>
			<p>Tu es connecté avec {user?.email}</p>
			<Button onClick={handleLogout}>
				Se déconnecter
			</Button>
		</div>
	)
}