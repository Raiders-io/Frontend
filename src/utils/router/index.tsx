import { createBrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/auth/login'
import SignupPage from '@/pages/auth/signup'
import HomePage from '@/pages/home'
import ProtectedRoute from '@/utils/router/protected_route'
import LessonPage from '@/pages/lesson/lesson_home_page'
import LessonHomePage from '@/pages/lesson/lesson_home_page'
import IndexPage from '@/pages/objects/index'

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
	{
		path: '/lessons/',
		element: <LessonHomePage />,
	},
	{
		path: '/lessons/:slug',
		element: <LessonPage />,
	},
	{
		path: '/objects/index',
		element: <IndexPage />,
	},
])
