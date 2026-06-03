import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import SignupPage from '@/pages/auth/signup'
import HomePage from '@/pages/home'
import ProtectedRoute from '@/utils/router/protected_route'

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
	},
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/signup',
		element: <SignupPage />,
	},
])