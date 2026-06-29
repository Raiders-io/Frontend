import { useAuthStore } from '@/utils/stores/auth_store'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '@/utils/hooks/use_chat'
import { userService } from '@/services/user_service'
import { Button } from '@/components/ui/button'
import type { User } from '@/utils/types/auth'

export default function UsersList() {
	const { createConversation } = useChat()
	const [users, setUsers] = useState<User[]>([])
	const { user, logout } = useAuthStore()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	useEffect(() => {
		userService.fetchUsers()
			.then((users) => setUsers(users))
			.catch(console.error)
	}, [])

	const startConversation = (userId: string) => {
		createConversation([userId])
		navigate('/chat')
	}

	return (
		<div>
			<h1>Bienvenue {user?.fullName}</h1>
			<p>Tu es connecté avec {user?.email}</p>
			<Button onClick={() => navigate('/chat')}>
				Messagerie
			</Button>
			<Button onClick={handleLogout}>
				Se déconnecter
			</Button>
			{users.map((user) => (
				<div key={user.id} className="flex items-center justify-between rounded-md border p-3">
					<span>{user.fullName}</span>
					<Button size="sm" onClick={() => startConversation(user.id)}>
						Démarrer une conversation
					</Button>
				</div>
			))}
		</div>
	)
}